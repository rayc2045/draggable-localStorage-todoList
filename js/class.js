'use strict';

class TodoApp {
	constructor() {
		this.todolist = JSON.parse(localStorage.getItem('todolist')) || [];
		this.accomplishSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BOTW_Fanfare_SmallItem.wav?raw=true'
		); // ../audio/BOTW_Fanfare_SmallItem.wav
		this.deleteSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BotW_Interact_sound.mp3?raw=true'
		); // ../audio/BotW_Interact_sound.mp3
		this.dragSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drag.mp3?raw=true'
		); // ../audio/drag.mp3
		this.dropSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drop.mp3?raw=true'
		); // ../audio/drop.mp3
		this.events();
	}

	events() {
		// this.debug();
		// this.demo_f2eLearning();
		this.updateTasks();
		this.addTask();
		this.toggleComplete();
		this.editTask();
		this.deleteTask();
		// jQueryUISortable();
		this.sortablejs();
		this.rearrangeTodolist();
	}

	debug() {
		const self = this;

		$('#todolist').on('click', function() {
			console.log(self.todolist);
		});

		$('.newItem input').keydown(function(e) {
			if (e.which === 13) {
				console.log('"' + $(this).val() + '" is added.');
			}
		});

		$('.items').on('click', '.delete', function() {
			console.log('"' + $(this).closest('.item').find('.content').text() + '" is deleted.');
		});

		$('.items').change(function() {
			console.log('.items changed');
		});
	}

	demo_f2eLearning() {
		localStorage.setItem(
			'todolist',
			JSON.stringify([
				{
					task: 'HTML + CSS 網頁基礎',
					completed: false
				},
				{
					task: 'Flexbox + CSS Grid 響應式佈局',
					completed: false
				},
				{
					task: 'JavaScript + DOM 操作',
					completed: false
				},
				{
					task: 'Git/Github 版本控制',
					completed: false
				},
				{
					task: '搭建網站/Github page',
					completed: false
				},
				{
					task: 'Node.js + NPM 套件管理',
					completed: false
				},
				{
					task: 'React.js/Vue.js 前端框架',
					completed: false
				},
				{
					task: 'HTTP + AJAX/JSON API 服務整合',
					completed: false
				},
				{
					task: '作品集 + 一頁式履歷',
					completed: false
				},
				{
					task: '尋找、取得 offer',
					completed: false
				}
			])
		);
	}

	updateTasks() {
		$('.items').empty();

		for (let i = 0; i < this.todolist.length; i++) {
			$('.items').append(`
        <div class="item" id="item_${i}">
          <div class="handle">: :</div>
          <input type="checkbox"${this.todolist[i].completed ? ' checked' : ''}>
          <div class="check">✓</div>
          <div class="content">${this.todolist[i].task}</div>
          <div class="delete">☓</div>
        </div>`);
		}
	}

	addTask() {
		const self = this;

		$('.newItem input').keydown(function(e) {
			if (e.which === 13) {
				// input, select, textarea 用 val；其他使用 text()
				// val() 會抓取內容，如果輸入值到括號中會變為輸出
				// trim() 刪除首尾空格
				const input = $(this).val().trim();

				if (!input) return;

				self.todolist.push({ task: input, completed: false });
				localStorage.setItem('todolist', JSON.stringify(self.todolist));
				self.updateTasks();
				$(this).val('');
				self.dropSound.currentTime = 0;
				self.dropSound.play();
			}
		});
	}

	toggleComplete() {
		const self = this;

		$('.items').on('click', 'input', function() {
			const index = $(this).closest('.item').attr('id').replace(/item_/g, '');

			self.todolist[index].completed = !self.todolist[index].completed;
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			$('.content').blur();

			if ($(this).is(':checked')) {
				// $('.accomplishSound')[0].play();
				self.accomplishSound.currentTime = 0;
				self.accomplishSound.play();
			}
		});
	}

	editTask() {
		const self = this;

		$('.items').on('mousedown', '.content', function() {
			$(this).prop('contenteditable', true);
		});

		$('.items').on('keydown', '.content', function(e) {
			if (e.which === 13) $(this).blur();
		});

		$('.items').on('blur', '.content', function() {
			const index = $(this).closest('.item').attr('id').replace(/item_/g, '');

			self.todolist[index].task = $(this).text().trim();
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			$(this).prop('contenteditable', false);
			self.updateTasks();
		});
	}

	deleteTask() {
		const self = this;

		$('.items').on('click', '.delete', function() {
			const item = $(this).closest('.item');
			const index = item.attr('id').replace(/item_/g, '');

			self.todolist.splice(index, 1);
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			item.remove();
			if (!self.todolist.length) localStorage.removeItem('todolist'); // It's not same to clear()
			self.updateTasks();
			self.deleteSound.currentTime = 0;
			self.deleteSound.play();
		});
	}

	jQueryUISortable() {
		$('#todolist .items').sortable({
			items: '.item',
			cancel: '.content',
			placeholder: 'dragging'
		});
	}

	sortablejs() {
		Sortable.create(sortable, {
			// disabled: false, // 關閉 Sortable
			animation: 100, // 物件移動時間(單位:毫秒)
			handle: '.handle', // 可拖曳的區域
			draggable: '.item', // 可拖曳的物件
			// filter: ".newItem",  // 過濾器，不能拖曳的物件
			// preventOnFilter: true, // 當過濾器啟動的時候，觸發 event.preventDefault()
			ghostClass: 'dragging' // 拖曳時，給予物件的類別
			// chosenClass: "dragging",  // 選定時，給予物件的類別
		});

		$('.items').on('mousedown', '.handle', () => {
			this.dragSound.currentTime = 0;
			this.dragSound.play();
		});
	}

	rearrangeTodolist() {
		const self = this;

		$('.items').change(function() {
			for (let i = 0; i < self.todolist.length; i++) {
				// 將 TodoApp.todolist 中的資料，複寫為 html 中順序對應的項目值
				self.todolist[i].task = $('.item').eq(i).find('.content').text();
				self.todolist[i].completed = $('.item').eq(i).find('input').prop('checked');

				localStorage.setItem('todolist', JSON.stringify(self.todolist));

				// 重置 html 中項目的 id 值
				$('.item').eq(i).attr('id', `item_${i}`);
				self.dropSound.currentTime = 0;
				self.dropSound.play();
			}
		});
	}
}

let todoApp = new TodoApp();
