const obj = {
	load: async (loader) => {
		loader = loader ?? pageLoader()

		{
			const controller = new AbortController()
			const timerId = setTimeout(() => controller.abort(), delayTime)
			let check = await loader.add(
				'userId',
				fetch('https://server.urepo.com.ua:8443/userauth/check', {
					credentials: 'include',
					signal: controller.signal,
				}).catch((err) => console.warn(err))
			)[0]
			clearTimeout(timerId)
			if (check?.ok) {
				if (!serverActive) {
					location.reload()
				}
				check = await check.text()
				var [userId, userType] = check.split('#')
			} else {
				if (serverActive) {
					location.reload()
				}
			}
		}

		if (serverActive) {
			var bookList = await (
				await loader.add(
					'bookList',
					fetch('https://server.urepo.com.ua:8443/books', {
						credentials: 'include',
					})
				)[0]
			).json()
			localStorage.setItem('bookList', JSON.stringify(bookList))
		} else {
			var bookList = JSON.parse(localStorage.getItem('bookList'))
			if (bookList == undefined) throw new Error("Page wasn't preloaded")
		}

		const series = Object.values(bookList).find((serie) =>
			serie.books.find((book) => book.id == urlParams.get('book'))
		)
		if (!series) throw new Error('Invalid address')
		const bookData = series.books.find(
			(book) => book.id == urlParams.get('book')
		)
		if (!bookData) throw new Error('Invalid address')

		const description = document.getElementById('description')
		const likes = description.querySelector('.likes')
		const bell = description.querySelector('.bell')
		const mark = description.querySelector('.mark')

		description.querySelector('.title').innerText = series.title
		description.querySelector('.subtitle').innerText = bookData.title
		description.querySelector('.author').innerHTML = bookData.authors
			.map((v) => {
				const [name, uid] = v.split('#')
				const href = `https://server.urepo.com.ua:8443/user/profile/${uid}`
				return `<a${
					href ? ` target="_blank" href="${href}"` : ''
				}>${name}</a>`
			})
			.join(', ')
		const descImg = description.querySelector('.picture img')
		descImg.src =
			'https://server.urepo.com.ua:8443/books/image/' +
			urlParams.get('book')
		loader.add(
			null,
			new Promise((res) => descImg.addEventListener('load', res))
		)

		if (serverActive) {
			const { state, likes: likesCount } = await (
				await fetch(
					'https://server.urepo.com.ua:8443/books/likes/' +
						urlParams.get('book'),
					{ credentials: 'include' }
				)
			).json()
			likes.innerText = likesCount
			if (state == 1) likes.classList.add('checked')

			if (state != -1)
				likes.addEventListener('click', async () => {
					const { state, likes: likesCount } = await (
						await fetch(
							'https://server.urepo.com.ua:8443/books/likes/' +
								urlParams.get('book'),
							{
								method: 'PUT',
								credentials: 'include',
							}
						)
					).json()
					likes.innerText = likesCount
					if (state == 1) likes.classList.add('checked')
					if (state == 0) likes.classList.remove('checked')
				})
			else
				likes.addEventListener('click', () =>
					showMessage(
						'Увага',
						'Лише авторизовані користувачі можуть виставляти рейтинг.',
						''
					)
				)
		} else {
			likes.style.display = 'none'
		}
		const continueBtn = description.querySelector('.continue')
		if (Object.keys(bookData.pages).length) {
			let href = localStorage.getItem('lastVisited')
			if (href) {
				continueBtn.innerText = 'Продовжити читання'
				continueBtn.addEventListener('click', () => {
					location = href
				})
			} else {
				continueBtn.innerText = 'Читати онлайн'
				continueBtn.addEventListener('click', () => {
					urlParams.set(
						'page',
						Object.values(bookData.pages).reduce(
							(t, v) => (v[0] < t ? v[0] : t),
							Infinity
						)
					)
					location = `https://${location.host}/bookreader/?${urlParams}`
				})
			}
		} else {
			continueBtn.innerText = 'В розробці'
			continueBtn.classList.add('disabled')
		}
		description.querySelector('.genre').innerHTML = bookData.genre
			.map((v) => `<span>${v}</span>`)
			.join('')
		description.querySelector('.pair[data-key="Дата виходу:"]').innerText =
			bookData.release
		description.querySelector('.pair[data-key="Розділів:"]').innerText =
			Object.keys(bookData.pages).length
		description.querySelector('.text').innerText = bookData.description
		{
			const chaptersList = description.querySelector('.chapter-list')
			chaptersList.innerHTML = ''
			const pages = Object.entries(bookData.pages)
				.sort(([, v1], [, v2]) => v1[0] > v2[0])
				.map((v) => [v[0], v[1][0]])
			for (const page of pages) {
				const elem = createElement(
					`<div class="button text">${page[0]}</div>`
				)
				elem.addEventListener('click', () => {
					urlParams.set('page', page[1])
					location = `https://${location.host}/bookreader/?${urlParams}`
				})
				chaptersList.appendChild(elem)
			}
		}

		likes.oncontextmenu = (e) => e.preventDefault()
		bell.oncontextmenu = (e) => e.preventDefault()
		mark.oncontextmenu = (e) => e.preventDefault()

		let f = false
		bell.addEventListener('click', () => {
			if (f) {
				bell.innerText = ''
			} else {
				bell.innerText = ''
			}
			f = !f
		})
		let f2 = false
		mark.addEventListener('click', () => {
			if (f2) {
				mark.innerText = ''
			} else {
				mark.innerText = ''
			}
			f2 = !f2
		})

		loader.release(() => {
			description.style.opacity = 1
			document.body.classList.add('page-title')
		})
	},
	unload: async () => {},
}

export default obj
