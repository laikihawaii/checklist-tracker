// UI Module - Handles rendering and DOM updates

class UIManager {
    constructor(dataManager) {
        this.dm = dataManager;
        this.currentTaskId = null;
        this.isRendering = false;
        this.currentGroupId = null;
    }

    setupTabButtons() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

     switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

      const tabElement = document.getElementById(`${tabName}Tab`);
      if (tabElement) tabElement.classList.add('active');

      document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

      if (tabName === 'statistics') {
          this.renderStatistics();
      } else if (tabName === 'template') {
          this.renderTemplate();
      } else if (tabName === 'checklist') {
          // Refresh checklist when switching to it to show any template changes
          this.renderCurrentTask();
      }
  }

    async renderCurrentTask() {
        const tasks = await this.dm.getTasks();

        if (tasks.length === 0) {
            document.getElementById('currentTaskName').textContent = 'No task yet';
            document.getElementById('taskDate').textContent = '';
            this.currentTaskId = null;
            document.getElementById('checklistContainer').innerHTML = '';
            return;
        }

        const task = tasks[0];
        this.currentTaskId = task.id;

        const date = new Date(task.timestamp);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        document.getElementById('currentTaskName').textContent = task.name;
        document.getElementById('taskDate').textContent = dateStr;
        await this.renderChecklist(task.checked_items || []);
    }

    async renderChecklist(checkedItemIds = []) {
        if (this.isRendering) return;
        this.isRendering = true;

        try {
            const container = document.getElementById('checklistContainer');
            container.innerHTML = '';

            const groups = await this.dm.getGroups();

            if (groups.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No items yet. Add items in Template tab.</p>';
                return;
            }

            groups.forEach(group => {
                const groupSection = document.createElement('div');
                groupSection.className = 'group-section';

                const header = document.createElement('div');
                header.className = 'group-header';
                header.textContent = group.name;
                groupSection.appendChild(header);

                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'group-items';

                const items = group.items || [];
                if (items.length === 0) {
                    const emptyMsg = document.createElement('p');
                    emptyMsg.style.cssText = 'text-align: center; color: #666; padding: 12px; font-size: 14px;';
                    emptyMsg.textContent = 'No items in this group';
                    itemsDiv.appendChild(emptyMsg);
                } else {
                    items.forEach(item => {
                        const isChecked = checkedItemIds.includes(item.id);
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'checklist-item';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `item-${item.id}`;
                        checkbox.checked = isChecked;
                        checkbox.dataset.itemId = item.id;
                        checkbox.addEventListener('change', () => this.onItemCheckChanged());

                        const label = document.createElement('label');
                        label.htmlFor = `item-${item.id}`;
                        label.textContent = item.name;

                        itemDiv.appendChild(checkbox);
                        itemDiv.appendChild(label);
                        itemsDiv.appendChild(itemDiv);
                    });
                }

                groupSection.appendChild(itemsDiv);
                container.appendChild(groupSection);
            });
        } finally {
            this.isRendering = false;
        }
    }

    async onItemCheckChanged() {
        if (!this.currentTaskId) return;
        const checkedItems = Array.from(document.querySelectorAll('.checklist-item input[type="checkbox"]:checked'))
            .map(cb => cb.dataset.itemId);
        await this.dm.updateTaskCheckedItems(this.currentTaskId, checkedItems);
    }

    async renderStatistics() {
        const tbody = document.getElementById('statsBody');
        tbody.innerHTML = '';

        const stats = await this.dm.getStatistics();
        const statsArray = Object.values(stats);

        if (statsArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #666;">No statistics yet</td></tr>';
            return;
        }

        statsArray.forEach(stat => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${stat.name}</td><td>${stat.count_checked} / ${stat.total_tasks}</td><td>${stat.percentage}%</td>`;
            tbody.appendChild(row);
        });
    }

    async renderTemplate() {
        await this.renderGroups();
        await this.renderItemsForFirstGroup();
    }

    async renderGroups() {
        const groupsList = document.getElementById('groupsList');
        groupsList.innerHTML = '';

        const groups = await this.dm.getGroups();

        if (groups.length === 0) {
            groupsList.innerHTML = '<p style="text-align: center; color: #666; padding: 12px;">No groups yet</p>';
            return;
        }

        groups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group-item';
            groupDiv.dataset.groupId = group.id;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'group-item-name';
            nameSpan.textContent = group.name;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'group-actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = '✎';
            editBtn.addEventListener('click', () => this.editGroup(group.id, group.name));

            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.addEventListener('click', () => this.deleteGroup(group.id));

            const upBtn = document.createElement('button');
            upBtn.textContent = '↑';
            upBtn.disabled = index === 0;
            upBtn.addEventListener('click', () => this.moveGroupUp(group.id));

            const downBtn = document.createElement('button');
            downBtn.textContent = '↓';
            downBtn.disabled = index === groups.length - 1;
            downBtn.addEventListener('click', () => this.moveGroupDown(group.id));

            groupDiv.addEventListener('click', (e) => {
                if (!e.target.closest('.group-actions')) {
                    this.selectGroup(group.id);
                }
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(delBtn);
            actionsDiv.appendChild(upBtn);
            actionsDiv.appendChild(downBtn);

            groupDiv.appendChild(nameSpan);
            groupDiv.appendChild(actionsDiv);
            groupsList.appendChild(groupDiv);
        });
    }

    async renderItemsForFirstGroup() {
        const groups = await this.dm.getGroups();
        if (groups.length > 0) {
            this.renderItemsForGroup(groups[0].id);
        } else {
            document.getElementById('itemsList').innerHTML = '';
        }
    }

    selectGroup(groupId) {
        document.querySelectorAll('.group-item').forEach(item => {
            item.style.backgroundColor = item.dataset.groupId === groupId ? '#E5E5EA' : '';
        });
        this.renderItemsForGroup(groupId);
    }

    async renderItemsForGroup(groupId) {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';

        const groups = await this.dm.getGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) return;

        const items = group.items || [];

        if (items.length === 0) {
            itemsList.innerHTML = '<p style="text-align: center; color: #666; padding: 12px;">No items in this group</p>';
        } else {
            items.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-row';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'item-name';
                nameSpan.textContent = item.name;

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'item-actions';

                const editBtn = document.createElement('button');
                editBtn.textContent = '✎';
                editBtn.addEventListener('click', () => this.editItem(groupId, item.id, item.name));

                const delBtn = document.createElement('button');
                delBtn.textContent = '✕';
                delBtn.addEventListener('click', () => this.deleteItem(groupId, item.id));

                const upBtn = document.createElement('button');
                upBtn.textContent = '↑';
                upBtn.disabled = index === 0;
                upBtn.addEventListener('click', () => this.moveItemUp(groupId, item.id));

                const downBtn = document.createElement('button');
                downBtn.textContent = '↓';
                downBtn.disabled = index === items.length - 1;
                downBtn.addEventListener('click', () => this.moveItemDown(groupId, item.id));

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(delBtn);
                actionsDiv.appendChild(upBtn);
                actionsDiv.appendChild(downBtn);

                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(actionsDiv);
                itemsList.appendChild(itemDiv);
            });
        }

        this.currentGroupId = groupId;
    }

    async editGroup(groupId, currentName) {
        const newName = prompt('Edit group name:', currentName);
        if (newName && newName.trim()) {
            await this.dm.updateGroup(groupId, newName.trim());
            await this.renderTemplate();
        }
    }

    async editItem(groupId, itemId, currentName) {
        const newName = prompt('Edit item name:', currentName);
        if (newName && newName.trim()) {
            await this.dm.updateItem(groupId, itemId, newName.trim());
            await this.renderItemsForGroup(groupId);
        }
    }

    async deleteGroup(groupId) {
        if (confirm('Delete this group? This will also delete all items in it.')) {
            await this.dm.deleteGroup(groupId);
            await this.renderTemplate();
        }
    }

    async deleteItem(groupId, itemId) {
        if (confirm('Delete this item?')) {
            await this.dm.deleteItem(groupId, itemId);
            await this.renderItemsForGroup(groupId);
        }
    }

    async moveGroupUp(groupId) {
        await this.dm.moveGroupUp(groupId);
        await this.renderTemplate();
    }

    async moveGroupDown(groupId) {
        await this.dm.moveGroupDown(groupId);
        await this.renderTemplate();
    }

    async moveItemUp(groupId, itemId) {
        await this.dm.moveItemUp(groupId, itemId);
        await this.renderItemsForGroup(groupId);
    }

    async moveItemDown(groupId, itemId) {
        await this.dm.moveItemDown(groupId, itemId);
        await this.renderItemsForGroup(groupId);
    }

    async onAddGroup() {
        const name = prompt('Enter group name:');
        if (name && name.trim()) {
            await this.dm.addGroup(name.trim());
            await this.renderTemplate();
        }
    }

    async onAddItem() {
        const input = document.getElementById('newItemInput');
        const name = input.value.trim();

        if (name && this.currentGroupId) {
            await this.dm.addItem(this.currentGroupId, name);
            input.value = '';
            await this.renderItemsForGroup(this.currentGroupId);
        }
    }

    async onNewTask() {
        showLoading(true);
        try {
            const task = await this.dm.addTask();
            await this.renderCurrentTask();
        } catch (error) {
            alert('Error creating task: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async onRenameTask() {
        if (!this.currentTaskId) {
            alert('No task to rename');
            return;
        }

        const currentName = document.getElementById('currentTaskName').textContent;
        const newName = prompt('Rename task:', currentName);

        if (newName && newName.trim()) {
            showLoading(true);
            try {
                await this.dm.renameTask(this.currentTaskId, newName.trim());
                await this.renderCurrentTask();
            } catch (error) {
                alert('Error renaming task: ' + error.message);
            } finally {
                showLoading(false);
            }
        }
    }

    async onDeleteTask() {
        if (!this.currentTaskId) {
            alert('No task to delete');
            return;
        }

        if (confirm('Delete this task? This action cannot be undone.')) {
            showLoading(true);
            try {
                await this.dm.deleteTask(this.currentTaskId);
                await this.renderCurrentTask();
            } catch (error) {
                alert('Error deleting task: ' + error.message);
            } finally {
                showLoading(false);
            }
        }
    }

    async onClearAll() {
        if (confirm('Delete all tasks? This action cannot be undone.')) {
            showLoading(true);
            try {
                await this.dm.deleteAllTasks();
                await this.renderCurrentTask();
            } catch (error) {
                alert('Error clearing tasks: ' + error.message);
            } finally {
                showLoading(false);
            }
        }
    }

    async onPreviousTask() {
        const tasks = await this.dm.getTasks();
        const currentIndex = tasks.findIndex(t => t.id === this.currentTaskId);

        if (currentIndex < tasks.length - 1) {
            this.currentTaskId = tasks[currentIndex + 1].id;
            await this.renderCurrentTask();
        }
    }

    async onNextTask() {
        const tasks = await this.dm.getTasks();
        const currentIndex = tasks.findIndex(t => t.id === this.currentTaskId);

        if (currentIndex > 0) {
            this.currentTaskId = tasks[currentIndex - 1].id;
            await this.renderCurrentTask();
        }
    }

    updateUserEmail(email) {
        document.getElementById('userEmail').textContent = email;
    }
}
