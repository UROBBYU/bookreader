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

		document.body.classList.add('page-main')

		for (const series of Object.keys(bookList)) {
			const bookbox = createElement(`<div class="bookbox">
                <div class="header">
                    <div class="title">${bookList[series].title}</div>
                    <div class="expander">&#xf053;</div>
                </div>
                <div class="overview collapsed">
                    <div class="description"></div>
                    <img>
                    <div class="start">Читати</div>
                </div>
                <div class="gallery">
                    <div class="arrow left disabled">&#xf053;</div>
                    <div class="scroll">
                        <div class="contents">${bookList[series].books.map(
							(book) =>
								`<img src="https://server.urepo.com.ua:8443/books/image/${book.id}" crossorigin>`
						)}</div>
                        <div class="selector"></div>
                    </div>
                    <div class="arrow right disabled">&#xf054;</div>
                </div>
            </div>`)
			document.getElementById('bookindex').appendChild(bookbox)
		}

		Array.from(document.querySelectorAll('img[data-src]')).map((img) => {
			img.src = img.dataset.src
			delete img.dataset.src
			loader.add(
				null,
				new Promise((res) => img.addEventListener('load', res))
			)
		})

		Array.from(document.querySelectorAll('.bookbox')).map(
			(bookbox) =>
				new Promise((res) => {
					const overview = bookbox.querySelector('.overview')
					const description = overview.querySelector('.description')
					const overviewImg = overview.querySelector('img')
					const overviewStart = overview.querySelector('.start')
					const header = bookbox.querySelector('.header')
					const expander = header.querySelector('.expander')
					const gallery = bookbox.querySelector('.gallery')
					const arrowLeft = gallery.querySelector('.arrow.left')
					const arrowRight = gallery.querySelector('.arrow.right')
					const scroll = gallery.querySelector('.scroll')
					const contents = scroll.querySelector('.contents')
					const selector = scroll.querySelector('.selector')

					const scrollWidth = scroll.getBoundingClientRect().width
					let maxGalPos = 0
					let ongoingTouches = []
					let lockedX = 0
					let lockedY = 0
					let selected

					const expand = (v) => {
						if (v ?? overview.classList.contains('collapsed')) {
							overview.classList.remove('collapsed')
							expander.classList.add('open')
						} else {
							overview.classList.add('collapsed')
							expander.classList.remove('open')
						}
					}

					arrowLeft.addEventListener('click', (e) => {
						const pos = gallery.style.getPropertyValue('--pos') - 1
						arrowRight.classList.remove('disabled')
						if (!pos) arrowLeft.classList.add('disabled')
						gallery.style.setProperty('--pos', pos)
					})
					arrowRight.addEventListener('click', (e) => {
						const pos =
							gallery.style.getPropertyValue('--pos') * 1 + 1
						arrowLeft.classList.remove('disabled')
						if (pos == maxGalPos)
							arrowRight.classList.add('disabled')
						gallery.style.setProperty('--pos', pos)
					})
					header.addEventListener('click', () => expand())

					description.onpointerdown = () => {
						const func = (e) => {
							if (e.target != description) {
								description.classList.remove('hover')
								window.removeEventListener('pointerdown', func)
								description.removeEventListener(
									'mouseout',
									func
								)
							}
						}
						window.addEventListener('pointerdown', func)
						description.addEventListener('mouseout', func)

						description.classList.add('hover')
					}

					scroll.addEventListener('touchstart', (e) => {
						Array.from(e.changedTouches).map((v) =>
							ongoingTouches.push({
								id: v.identifier,
								x: v.pageX,
								y: v.pageY,
							})
						)
					})
					scroll.addEventListener('touchend', (e) => {
						Array.from(e.changedTouches).map((v) => {
							const i = ongoingTouches.findIndex(
								(t) => t.id == v.identifier
							)
							if (i != -1) {
								if (lockedY) null
								else if (
									!arrowRight.classList.contains(
										'disabled'
									) &&
									ongoingTouches[i].x - v.pageX > 50
								)
									arrowRight.click()
								else if (
									!arrowLeft.classList.contains('disabled') &&
									ongoingTouches[i].x - v.pageX < -50
								)
									arrowLeft.click()
								ongoingTouches.splice(i, 1)
							}
						})
						lockedX = 0
						lockedY = 0
					})
					scroll.addEventListener('touchmove', (e) => {
						Array.from(e.changedTouches).map((v) => {
							const i = ongoingTouches.findIndex(
								(t) => t.id == v.identifier
							)
							if (i != -1) {
								if (
									!lockedY &&
									(ongoingTouches[i].x - v.pageX > 10 ||
										ongoingTouches[i].x - v.pageX < -10)
								)
									lockedX = 1
								else if (
									!lockedX &&
									(ongoingTouches[i].y - v.pageY > 10 ||
										ongoingTouches[i].y - v.pageY < -10)
								)
									lockedY = 1
							}
						})
						if (lockedX) e.preventDefault()
					})

					{
						let list = []

						const adjust = () => {
							const margin =
								(scrollWidth -
									(list.reduce((t, v) => t + v.width, 0) +
										(list.length - 1) * 20)) /
								(list.length + 1)
							list[0].style.setProperty(
								'--mar-left',
								margin / scrollWidth
							)
							list[list.length - 1].style.setProperty(
								'--mar-right',
								margin / scrollWidth
							)
							for (const elem of list) {
								if (list[0] != elem)
									elem.style.setProperty(
										'--mar-left',
										(margin + 20) / scrollWidth
									)
							}
						}

						const select = (img) => {
							selector.style.setProperty(
								'--elem-width',
								img.getBoundingClientRect().width / scrollWidth
							)
							selector.style.setProperty(
								'--elem-margin',
								(gallery.style.getPropertyValue('--pos') *
									scroll.getBoundingClientRect().width +
									img.getBoundingClientRect().x -
									arrowLeft.getBoundingClientRect().width -
									arrowLeft.getBoundingClientRect().x) /
									scrollWidth
							)
							overviewImg.src = img.src
							overviewImg.onclick = () => {
								location =
									`https://${location.host}/bookreader/?book=` +
									img.src.split('/').pop()
							}
							selected = img
							const series = Object.values(bookList).find(
								(serie) =>
									serie.books.find(
										(book) =>
											book.id == img.src.split('/').pop()
									)
							)
							const book = series.books.find(
								(book) => book.id == img.src.split('/').pop()
							)
							description.innerText = book.description
						}

						let f = false
						let int = 0
						overviewStart.addEventListener('mouseover', () => {
							int = setTimeout(() => {
								f = true
							}, 100)
						})
						overviewStart.addEventListener('mouseout', () => {
							clearTimeout(int)
							f = false
						})
						overviewStart.addEventListener('mousedown', () => {
							if (f) overviewImg.click()
						})

						const imgPromises = Array.from(contents.children).map(
							(v) =>
								v.complete
									? null
									: new Promise((res) =>
											v.addEventListener('load', res)
									  )
						)

						loader.add(null, imgPromises)

						Promise.all(imgPromises).then(() => {
							for (const img of contents.children) {
								if (
									list.reduce((t, v) => t + v.width, 0) +
										img.width +
										list.length * 20 <=
									scrollWidth
								)
									list.push(img)
								else {
									maxGalPos++
									adjust()
									list = [img]
								}
								img.addEventListener('click', () => {
									if (selected == img) {
										overviewStart.style.pointerEvents =
											'none'
										overviewStart.style.opacity = 1
										setTimeout(() => {
											overviewStart.style.pointerEvents =
												''
											overviewStart.style.opacity = ''
										}, 600)
									}
									description.classList.add('disabled')
									setTimeout(() => {
										description.addEventListener(
											'mouseout',
											() => {
												description.classList.remove(
													'disabled'
												)
											},
											{ once: true }
										)
										description.addEventListener(
											'mouseover',
											() => {
												description.classList.remove(
													'disabled'
												)
											},
											{ once: true }
										)
									}, 200)
									select(img)
									expand(1)
								})
							}
							adjust()
							select(contents.children[0])
							if (maxGalPos > 0)
								arrowRight.classList.remove('disabled')
							res()
						})
					}
				})
		)

		loader.release(() => {
			document.getElementById('bookindex').style.opacity = 1
		})
	},
	unload: async () => {},
}

export default obj
