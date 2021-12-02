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
		const book = series.books.find(
			(book) => book.id == urlParams.get('book')
		)
		if (!book) throw new Error('Invalid address')

		let pages = await loader.add(
			null,
			new Promise((res) => {
				const pages = {}

				const request = indexedDB.open('bookreader')

				request.onupgradeneeded = () =>
					request.result
						.createObjectStore('pages', {
							keyPath: ['id', 'index'],
						})
						.createIndex('id-index', ['id', 'index'], {
							unique: true,
						})

				request.onsuccess = () => {
					const objectStore = request.result
						.transaction('pages', 'readwrite')
						.objectStore('pages')

					objectStore.getAllKeys().onsuccess = (e) => {
						const promises = []
						for (const key of e.target.result.filter(
							(v) => v[0] == urlParams.get('book')
						)) {
							promises.push(
								new Promise((res) => {
									objectStore.get(key).onsuccess = (e) => {
										pages[e.target.result.text[0]] =
											e.target.result.version
										res()
									}
								})
							)
						}
						Promise.all(promises).then(() => res(pages))
					}
				}

				request.onerror = () => {
					throw new Error("Cannot open 'bookreader' database")
				}
			})
		)[0]

		if (serverActive) {
			pages = await (
				await loader.add(
					'pages',
					fetch(
						'https://server.urepo.com.ua:8443/books/' +
							urlParams.get('book'),
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								'Content-Type':
									'application/json; charset=utf-8',
							},
							body: JSON.stringify(pages),
						}
					)
				)[0]
			).json()

			await new Promise((res) => {
				const request = indexedDB.open('bookreader')

				request.onsuccess = (e) => {
					const os = e.target.result
						.transaction('pages', 'readwrite')
						.objectStore('pages')

					const promises = []
					for (const page of pages) {
						promises.push(
							new Promise((res) => {
								os.put({
									id: urlParams.get('book'),
									index: book.pages[page[0]][0],
									version: book.pages[page[0]][1],
									text: page,
								}).onsuccess = (e) => {
									res()
								}
							})
						)
					}
					Promise.all(promises).then(() => res(pages))
				}

				request.onerror = () => {
					throw new Error("Cannot open 'bookreader' database")
				}
			})
		}

		{
			await new Promise((res) => {
				const request = indexedDB.open('bookreader')

				request.onsuccess = (e) => {
					const os = e.target.result
						.transaction('pages', 'readonly')
						.objectStore('pages')

					pages = []
					const promises = []
					for (const page of Object.values(book.pages)) {
						promises.push(
							new Promise((res) => {
								os.get([
									urlParams.get('book'),
									page[0],
								]).onsuccess = (e) => {
									if (e.target.result)
										pages.push(e.target.result.text)
									res()
								}
							})
						)
					}
					Promise.all(promises).then(() => res(pages))
				}

				request.onerror = () => {
					throw new Error("Cannot open 'bookreader' database")
				}
			})
		}

		const chapterList = document.getElementById('chapter-list')

		const selectChapter = (elem) => {
			for (const child of chapterList.children) {
				if (child == elem) child.classList.add('selected')
				else child.classList.remove('selected')
			}
		}

		const doc = document.getElementById('document')
		const header = document.querySelector('header')
		const main = document.querySelector('main')

		const updatePage = () => {
			const pageName = Object.entries(book.pages).find(
				([, v]) => v[0] == urlParams.get('page')
			)?.[0]
			const page = pages.find((page) => page[0] == pageName)
			if (!page) {
				throw new Error('Invalid address')
			}

			for (const elem of chapterList.children)
				if (elem.innerText == pageName) {
					selectChapter(elem)
					break
				}

			if (serverActive) {
				document.querySelector(
					'#comments-block .load.button'
				).style.display = ''
				document.querySelector(
					'#comments-block .comments-list'
				).style.display = ''
				document.querySelector(
					'#suggestions .load.button'
				).style.display = ''
				document.querySelector(
					'#suggestions .suggestions-list'
				).style.display = ''
				document.querySelector(
					'#suggestions .new-suggestion'
				).style.display = ''

				if (userId == 'unauthorized') {
					document.querySelector(
						'#comments-block .new-comment'
					).style.display = 'none'
					document.querySelector(
						'#upper-popup .suggest-edits'
					).style.display = 'none'
				}
				if (userType == 'M' || userType == 'A')
					document.querySelector(
						'#upper-popup .suggest-edits'
					).style.display = 'block'
			}

			const arrows = createElement('<div class="arrows"></div>')
			const arrowLeft = createElement(
				'<div class="button arrow left" title="Попередня сторінка">&#xf053;</div>'
			)
			arrows.appendChild(arrowLeft)
			const arrowRight = createElement(
				'<div class="button arrow right" title="Наступна сторінка">&#xf054;</div>'
			)
			arrows.appendChild(arrowRight)
			doc.innerHTML = `<h1>${pageName}</h1><p>${page
				.filter((v, i) => i > 0)
				.join('</p><p>')}</p>`
			doc.appendChild(arrows)
			document.getElementById('title').innerText = pageName

			const chapterLeft = document.getElementById('chapter-left')
			const prevPage = Object.entries(book.pages).reduce(
				(t, v) =>
					v[1][0] < urlParams.get('page') && v[1][0] > t
						? v[1][0]
						: t,
				-Infinity
			)
			if (Number.isFinite(prevPage)) {
				const toPrev = () => {
					urlParams.set('page', prevPage)
					history.replaceState(null, '', `/bookreader/?${urlParams}`)
					updatePage()
				}
				arrowLeft.onclick = toPrev
				arrowLeft.style = ''
				chapterLeft.onclick = toPrev
				chapterLeft.style = ''
			} else {
				arrowLeft.style.opacity = '0.5'
				arrowLeft.style.pointerEvents = 'none'
				chapterLeft.style.opacity = '0.5'
				chapterLeft.style.pointerEvents = 'none'
			}

			const chapterRight = document.getElementById('chapter-right')
			const nextPage = Object.entries(book.pages).reduce(
				(t, v) =>
					v[1][0] > urlParams.get('page') && v[1][0] < t
						? v[1][0]
						: t,
				Infinity
			)
			if (Number.isFinite(nextPage)) {
				const toNext = () => {
					urlParams.set('page', nextPage)
					history.replaceState(null, '', `/bookreader/?${urlParams}`)
					updatePage()
				}
				arrowRight.onclick = toNext
				arrowRight.style = ''
				chapterRight.onclick = toNext
				chapterRight.style = ''
			} else {
				arrowRight.style.opacity = '0.5'
				arrowRight.style.pointerEvents = 'none'
				chapterRight.style.opacity = '0.5'
				chapterRight.style.pointerEvents = 'none'
			}

			setTimeout(() => {
				document.querySelector('main').scrollTop =
					JSON.parse(localStorage.getItem('scroll') ?? '{}')[
						urlParams.get('book') + '-' + urlParams.get('page')
					] ?? 0
			}, 200)
			localStorage.setItem('lastVisited', location.href)
		}

		loader.release(async () => {
			if (serverActive) {
				const upperPopup = document.getElementById('upper-popup')
				document.addEventListener('selectionchange', () => {
					const sel = document.getSelection()
					if (
						sel.type == 'Range' &&
						doc.contains(sel.anchorNode) &&
						doc.contains(sel.focusNode)
					) {
						upperPopup.classList.add('show')
					} else upperPopup.classList.remove('show')
				})
			}

			{
				chapterList.innerHTML = ''
				for (const page of Object.entries(book.pages)
					.sort(([, v1], [, v2]) => v1[0] > v2[0])
					.map((v) => [v[0], v[1][0]])) {
					const elem = createElement(
						`<div class="button text">${page[0]}</div>`
					)
					elem.addEventListener('click', () => {
						selectChapter(elem)
						urlParams.set('page', page[1])
						history.replaceState(
							null,
							'',
							`/bookreader/?${urlParams}`
						)
						updatePage()
					})
					chapterList.appendChild(elem)
				}
			}

			updatePage()
			const titles = document.getElementById('titles')
			titles.addEventListener('click', () => {
				urlParams.delete('page')
				location = `https://${location.host}/bookreader/?${urlParams}`
			})
			titles.children[0].innerHTML = series.smallTitle
			titles.children[1].innerHTML = book.smallTitle

			//* Scroll

			const headerHeight = document
				.querySelector('header')
				.getBoundingClientRect().height
			let scrollBacktrack = 0
			let scrollTicking = false
			let scrollAtTop = true
			let scrollAtBot = false
			main.addEventListener('scroll', () => {
				if (!scrollTicking)
					requestAnimationFrame(() => {
						const scrollTop = Math.max(0, main.scrollTop)
						const diff = scrollTop - scrollBacktrack
						if (diff > 0 && scrollAtTop) scrollAtTop = false
						if (diff < headerHeight && scrollAtBot)
							scrollAtBot = false
						if (!scrollAtTop && !scrollAtBot) {
							if (diff < 0) {
								scrollBacktrack = scrollTop
								header.style.top = ''
								scrollAtTop = true
							} else if (diff > headerHeight) {
								scrollBacktrack = scrollTop - headerHeight
								header.style.top = '-100%'
								scrollAtBot = true
							}
						} else
							scrollBacktrack =
								scrollTop - (scrollAtTop ? 0 : headerHeight)
						scrollTicking = false
					})
				scrollTicking = true
			})
			const scrollData = JSON.parse(
				localStorage.getItem('scroll') ?? '{}'
			)
			setInterval(() => {
				scrollData[
					urlParams.get('book') + '-' + urlParams.get('page')
				] = document.querySelector('main').scrollTop
				localStorage.setItem('scroll', JSON.stringify(scrollData))
			}, 200)

			main.querySelector('footer').style.opacity = 1
			document.body.classList.add('page-reader')
			main.querySelector('footer').style.maxWidth =
				doc.getBoundingClientRect().width + 'px'
		})
	},
	unload: async () => {},
}

export default obj
