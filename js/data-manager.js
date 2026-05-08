// Data Manager - Handles all Firebase Firestore operations
// Mirrors the Python models.py logic

class DataManager {
    constructor(userId) {
        this.userId = userId;
        this.userDocRef = db.collection('users').doc(userId);
    }

    // ========== GROUPS ==========

    async addGroup(name) {
        try {
            const groupId = this.generateId();
            const groupData = {
                id: groupId,
                name: name,
                items: [],
                order: (await this.getGroupsCount())
            };

            await this.userDocRef.collection('template_groups').doc(groupId).set(groupData);
            return groupId;
        } catch (error) {
            console.error('Error adding group:', error);
            throw error;
        }
    }

    async getGroups() {
        try {
            const snapshot = await this.userDocRef.collection('template_groups').orderBy('order').get();
            const groups = [];
            snapshot.forEach(doc => {
                groups.push({ id: doc.id, ...doc.data() });
            });
            return groups;
        } catch (error) {
            console.error('Error getting groups:', error);
            return [];
        }
    }

    async getGroupsCount() {
        const groups = await this.getGroups();
        return groups.length;
    }

    async updateGroup(groupId, newName) {
        try {
            await this.userDocRef.collection('template_groups').doc(groupId).update({
                name: newName
            });
        } catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    }

    async deleteGroup(groupId) {
        try {
            await this.userDocRef.collection('template_groups').doc(groupId).delete();
        } catch (error) {
            console.error('Error deleting group:', error);
            throw error;
        }
    }

    async moveGroupUp(groupId) {
        try {
            const groups = await this.getGroups();
            const index = groups.findIndex(g => g.id === groupId);

            if (index > 0) {
                const temp = groups[index].order;
                groups[index].order = groups[index - 1].order;
                groups[index - 1].order = temp;

                const batch = db.batch();
                batch.update(
                    this.userDocRef.collection('template_groups').doc(groups[index].id),
                    { order: groups[index].order }
                );
                batch.update(
                    this.userDocRef.collection('template_groups').doc(groups[index - 1].id),
                    { order: groups[index - 1].order }
                );
                await batch.commit();
            }
        } catch (error) {
            console.error('Error moving group up:', error);
            throw error;
        }
    }

    async moveGroupDown(groupId) {
        try {
            const groups = await this.getGroups();
            const index = groups.findIndex(g => g.id === groupId);

            if (index < groups.length - 1) {
                const temp = groups[index].order;
                groups[index].order = groups[index + 1].order;
                groups[index + 1].order = temp;

                const batch = db.batch();
                batch.update(
                    this.userDocRef.collection('template_groups').doc(groups[index].id),
                    { order: groups[index].order }
                );
                batch.update(
                    this.userDocRef.collection('template_groups').doc(groups[index + 1].id),
                    { order: groups[index + 1].order }
                );
                await batch.commit();
            }
        } catch (error) {
            console.error('Error moving group down:', error);
            throw error;
        }
    }

    // ========== ITEMS ==========

    async addItem(groupId, name) {
        try {
            const itemId = this.generateId();
            const groupRef = this.userDocRef.collection('template_groups').doc(groupId);
            const groupSnap = await groupRef.get();
            const itemsCount = groupSnap.data().items ? groupSnap.data().items.length : 0;

            const itemData = {
                id: itemId,
                name: name,
                order: itemsCount
            };

            const items = groupSnap.data().items || [];
            items.push(itemData);

            await groupRef.update({ items: items });
            return itemId;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    async updateItem(groupId, itemId, newName) {
        try {
            const groupRef = this.userDocRef.collection('template_groups').doc(groupId);
            const groupSnap = await groupRef.get();
            const items = groupSnap.data().items || [];

            const itemIndex = items.findIndex(i => i.id === itemId);
            if (itemIndex !== -1) {
                items[itemIndex].name = newName;
                await groupRef.update({ items: items });
            }
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    async deleteItem(groupId, itemId) {
        try {
            const groupRef = this.userDocRef.collection('template_groups').doc(groupId);
            const groupSnap = await groupRef.get();
            const items = (groupSnap.data().items || []).filter(i => i.id !== itemId);

            await groupRef.update({ items: items });
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

    async moveItemUp(groupId, itemId) {
        try {
            const groupRef = this.userDocRef.collection('template_groups').doc(groupId);
            const groupSnap = await groupRef.get();
            const items = groupSnap.data().items || [];

            const index = items.findIndex(i => i.id === itemId);
            if (index > 0) {
                const temp = items[index].order;
                items[index].order = items[index - 1].order;
                items[index - 1].order = temp;

                // Sort by order
                items.sort((a, b) => a.order - b.order);
                await groupRef.update({ items: items });
            }
        } catch (error) {
            console.error('Error moving item up:', error);
            throw error;
        }
    }

    async moveItemDown(groupId, itemId) {
        try {
            const groupRef = this.userDocRef.collection('template_groups').doc(groupId);
            const groupSnap = await groupRef.get();
            const items = groupSnap.data().items || [];

            const index = items.findIndex(i => i.id === itemId);
            if (index < items.length - 1) {
                const temp = items[index].order;
                items[index].order = items[index + 1].order;
                items[index + 1].order = temp;

                // Sort by order
                items.sort((a, b) => a.order - b.order);
                await groupRef.update({ items: items });
            }
        } catch (error) {
            console.error('Error moving item down:', error);
            throw error;
        }
    }

    // ========== TASKS ==========

    async addTask(name = '') {
        try {
            const taskId = this.generateId();
            const now = new Date().toISOString();

            const taskData = {
                id: taskId,
                name: name || this.generateTaskName(),
                timestamp: now,
                checked_items: [],
                date: now.split('T')[0] // Store date for querying
            };

            await this.userDocRef.collection('tasks').doc(taskId).set(taskData);
            return taskData;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }

    async getTasks() {
        try {
            const snapshot = await this.userDocRef.collection('tasks').orderBy('timestamp', 'desc').get();
            const tasks = [];
            snapshot.forEach(doc => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            return tasks;
        } catch (error) {
            console.error('Error getting tasks:', error);
            return [];
        }
    }

    async updateTask(taskId, updates) {
        try {
            await this.userDocRef.collection('tasks').doc(taskId).update(updates);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async updateTaskCheckedItems(taskId, checkedItemIds) {
        try {
            await this.userDocRef.collection('tasks').doc(taskId).update({
                checked_items: checkedItemIds
            });
        } catch (error) {
            console.error('Error updating checked items:', error);
            throw error;
        }
    }

    async renameTask(taskId, newName) {
        try {
            await this.updateTask(taskId, { name: newName });
        } catch (error) {
            console.error('Error renaming task:', error);
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            await this.userDocRef.collection('tasks').doc(taskId).delete();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    async deleteAllTasks() {
        try {
            const tasks = await this.getTasks();
            const batch = db.batch();

            tasks.forEach(task => {
                batch.delete(this.userDocRef.collection('tasks').doc(task.id));
            });

            await batch.commit();
        } catch (error) {
            console.error('Error deleting all tasks:', error);
            throw error;
        }
    }

    // ========== STATISTICS ==========

    async getStatistics(currentTaskId = null) {
        try {
            const tasks = await this.getTasks();
            const groups = await this.getGroups();

            // Include current task if provided
            let allTasks = [...tasks];
            if (currentTaskId) {
                const currentTask = tasks.find(t => t.id === currentTaskId);
                if (currentTask && !allTasks.find(t => t.id === currentTaskId)) {
                    // Current task is already in the list or will be
                }
            }

            const stats = {};
            const totalTasks = allTasks.length;

            if (totalTasks === 0) return stats;

            // Iterate through all items in all groups
            groups.forEach(group => {
                (group.items || []).forEach(item => {
                    const countChecked = allTasks.filter(task =>
                        task.checked_items && task.checked_items.includes(item.id)
                    ).length;

                    const percentage = totalTasks > 0 ? (countChecked / totalTasks * 100) : 0;

                    stats[item.id] = {
                        name: item.name,
                        count_checked: countChecked,
                        percentage: percentage.toFixed(1),
                        total_tasks: totalTasks
                    };
                });
            });

            return stats;
        } catch (error) {
            console.error('Error getting statistics:', error);
            return {};
        }
    }

    // ========== UTILITY ==========

    generateTaskName() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.');
        const dateParts = dateStr.split('.');
        const shortDate = `${dateParts[0]}.${dateParts[1]}${dateParts[2]}`;

        // Count tasks created today (this will be approximation for now)
        // In production, you'd query tasks by date
        const tradeNum = 1; // Default to 1, will be updated dynamically

        return `${shortDate}-trade${tradeNum}`;
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Ensure user document exists
    async ensureUserDoc() {
        try {
            const userSnap = await this.userDocRef.get();
            if (!userSnap.exists) {
                // Create user document with initial data
                await this.userDocRef.set({
                    email: auth.currentUser.email,
                    createdAt: new Date().toISOString()
                });

                // Create a default group
                await this.addGroup('Default');
            }
        } catch (error) {
            console.error('Error ensuring user doc:', error);
        }
    }
}
