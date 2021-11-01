if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')

(async () => {
    //* Updates

    if (!localStorage.getItem('version')) {
        localStorage.clear()
        localStorage.setItem('version', 1)
    }

    //* Elements

    const header = document.querySelector('header')
    const upperNavbar = header.querySelector('#upper-navbar')
    const titles = upperNavbar.querySelector('#titles')
    const settings = upperNavbar.querySelector('#settings')
    const themeSwitch = upperNavbar.querySelector('#theme-switch')
    const inboxButton = upperNavbar.querySelector('#inbox')
    const profileButton = upperNavbar.querySelector('#profile')
    const index = upperNavbar.querySelector('#index')
    const netherNavbar = header.querySelector('#nether-navbar')
    const chapterLeft = netherNavbar.querySelector('#chapter-left')
    const chapterRight = netherNavbar.querySelector('#chapter-right')
    const chapter = netherNavbar.querySelector('#chapter')
    const title = chapter.querySelector('#title')

    const main = document.querySelector('main')
    const doc = main.querySelector('#document')
    const description = main.querySelector('#description')
    const likes = description.querySelector('.likes')
    const bell = description.querySelector('.bell')
    const mark = description.querySelector('.mark')
    const bookIndex = main.querySelector('#bookindex')
    const mainFooter = main.querySelector('footer')
    const mainSelector = mainFooter.querySelector('.selector')
    const suggestionsBlock = mainFooter.querySelector('#suggestions')
    const suggestionNew = suggestionsBlock.querySelector('.new-suggestion')
    const suggestionsLoad = suggestionsBlock.querySelector('.load.button')
    const suggestionsList = suggestionsBlock.querySelector('.suggestions-list')
    const commentsBlock = mainFooter.querySelector('#comments-block')
    const commentNew = commentsBlock.querySelector('.new-comment')
    const commentsLoad = commentsBlock.querySelector('.load.button')
    const commentsList = commentsBlock.querySelector('.comments-list')

    const upperPopup = document.querySelector('#upper-popup')
    const quoteButton = upperPopup.querySelector('.quote')
    const suggestButton = upperPopup.querySelector('.suggest-edits')
    const overlay = document.querySelector('#overlay')
    const inboxPopup = overlay.querySelector('#inbox-popup')
    const upperPad = overlay.querySelector('#upper-pad')
    const chapterList = upperPad.querySelector('#chapter-list')
    const upperPadClose = upperPad.querySelector('#upper-pad-close')
    const leftPad = overlay.querySelector('#left-pad')
    const leftPadHome = leftPad.querySelector('.home')
    const leftPadBookmarks = leftPad.querySelector('.bookmarks')
    const leftPadSubPanel = leftPad.querySelector('.sub-panel')
    const leftPadClose = leftPad.querySelector('.close')
    const message = overlay.querySelector('#message')
    const messageClose = message.querySelector('#message-close')

    const themeBlack = document.querySelector('#theme-black')
    const themeWhite = document.querySelector('#theme-white')
    const themePaper = document.querySelector('#theme-paper')
    const pageSizeStandard = document.querySelector('#page-size-standard')
    const pageSize50 = document.querySelector('#page-size-50')
    const pageSize80 = document.querySelector('#page-size-80')
    const pageSize100 = document.querySelector('#page-size-100')
    const edgesSmall = document.querySelector('#edges-small')
    const edgesMedium = document.querySelector('#edges-medium')
    const edgesBig = document.querySelector('#edges-big')
    const fontNoto = document.querySelector('#font-noto')
    const fontRoboto = document.querySelector('#font-roboto')
    const fontPhilosopher = document.querySelector('#font-philosopher')
    const fontTimes = document.querySelector('#font-times')
    const fontSizeDec = document.querySelector('#font-size-dec')
    const fontSizeVal = document.querySelector('#font-size-val')
    const fontSizeInc = document.querySelector('#font-size-inc')
    const lineHeightDec = document.querySelector('#line-height-dec')
    const lineHeightVal = document.querySelector('#line-height-val')
    const lineHeightInc = document.querySelector('#line-height-inc')
    const lineMarginDec = document.querySelector('#line-margin-dec')
    const lineMarginVal = document.querySelector('#line-margin-val')
    const lineMarginInc = document.querySelector('#line-margin-inc')
    const letterSpaceDec = document.querySelector('#letter-space-dec')
    const letterSpaceVal = document.querySelector('#letter-space-val')
    const letterSpaceInc = document.querySelector('#letter-space-inc')
    const paragraphOn = document.querySelector('#paragraph-on')
    const paragraphOff = document.querySelector('#paragraph-off')
    const textAlignLeft = document.querySelector('#text-align-left')
    const textAlignJustify = document.querySelector('#text-align-justify')

    //* Navigation

    const toggleModal = (type, func) => {
        if (type) {
            overlay.className = type
            document.body.style.overflow = 'hidden'
        } else {
            overlay.className = ''
            document.body.style.overflow = ''
        }
        if (func) overlay.addEventListener('click', func, {once: true})
    }

    inboxPopup.addEventListener('click', e => e.stopPropagation())
    upperPad.addEventListener('click', e => e.stopPropagation())
    leftPad.addEventListener('click', e => e.stopPropagation())
    message.addEventListener('click', e => e.stopPropagation())

    themeSwitch.addEventListener('click', () => {
        if (document.body.classList.contains('theme-black')) {
            document.body.classList.remove('theme-black')
            document.body.classList.add('theme-paper')
            localStorage.setItem('settings-theme', 'paper')
        } else if (document.body.classList.contains('theme-paper')) {
            document.body.classList.remove('theme-paper')
            localStorage.setItem('settings-theme', 'white')
        } else {
            document.body.classList.add('theme-black')
            localStorage.setItem('settings-theme', 'black')
        }
    })

    leftPadHome.addEventListener('click', () => {
        location = 'https://urepo.com.ua/bookreader/'
    })

    inboxButton.addEventListener('click', () => {
        inboxButton.innerText = ''
        toggleModal('inbox', () => {
            if (inboxPopup.innerHTML != 'Тут наразі пусто.') inboxButton.innerText = ''
        })
    })
    settings.addEventListener('click', () => toggleModal('settings'))
    index.addEventListener('click', () => toggleModal('index'))
    chapter.addEventListener('click', () => toggleModal('chapters'))
    
    upperPadClose.addEventListener('click', () => toggleModal())
    leftPadClose.addEventListener('click', () => {
        toggleModal()
        leftPadBookmarks.classList.remove('meta')
        leftPadSubPanel.classList.add('disabled')
        leftPadSubPanel.innerHTML = ''
    })
    messageClose.addEventListener('click', () => toggleModal())
    overlay.addEventListener('click', () => {
        toggleModal()
        leftPadBookmarks.classList.remove('meta')
        leftPadSubPanel.classList.add('disabled')
        leftPadSubPanel.innerHTML = ''
    })

    //* Settings

    if (!localStorage.getItem('settings-theme')) {
        localStorage.setItem('settings-theme', 'white')
        localStorage.setItem('settings-pageSize', 'standard')
        localStorage.setItem('settings-edges', 'small')
        localStorage.setItem('settings-font', 'noto')
        localStorage.setItem('settings-fontSize', '16')
        localStorage.setItem('settings-lineHeight', '1.3')
        localStorage.setItem('settings-lineMargin', '0')
        localStorage.setItem('settings-letterSpace', '0.4')
        localStorage.setItem('settings-paragraph', 'off')
        localStorage.setItem('settings-text-align', 'left')
    }
    const updateSettings = async () => {
        const settingsData = {
            theme: localStorage.getItem('settings-theme'),
            pageSize: localStorage.getItem('settings-pageSize'),
            edges: localStorage.getItem('settings-edges'),
            font: localStorage.getItem('settings-font'),
            fontSize: localStorage.getItem('settings-fontSize'),
            lineHeight: localStorage.getItem('settings-lineHeight'),
            lineMargin: localStorage.getItem('settings-lineMargin'),
            letterSpace: localStorage.getItem('settings-letterSpace'),
            paragraph: localStorage.getItem('settings-paragraph'),
            textAlign: localStorage.getItem('settings-text-align')
        }

        const select = elem => {
            if (!elem.classList.contains('selected')) {
                for (const neighbor of elem.parentElement.children) neighbor.classList.remove('selected')
                elem.classList.add('selected')
            }
        }

        document.body.classList.remove('theme-black')
        document.body.classList.remove('theme-paper')
        switch (settingsData.theme) {
            case 'black':
                document.body.classList.add('theme-black')
                select(themeBlack)
                break
            case 'white':
                select(themeWhite)
                break
            case 'paper':
                document.body.classList.add('theme-paper')
                select(themePaper)
        }
        switch (settingsData.pageSize) {
            case 'standard':
                doc.style.marginInline = ''
                doc.style.maxWidth = ''
                select(pageSizeStandard)
                break
            case '50':
                doc.style.marginInline = '25vw'
                doc.style.maxWidth = '100vw'
                select(pageSize50)
                break
            case '80':
                doc.style.marginInline = '10vw'
                doc.style.maxWidth = '100vw'
                select(pageSize80)
                break
            case '100':
                doc.style.marginInline = '0'
                doc.style.maxWidth = '100vw'
                select(pageSize100)
        }
        switch (settingsData.edges) {
            case 'small':
                doc.style.paddingInline = '10px'
                select(edgesSmall)
                break
            case 'medium':
                doc.style.paddingInline = '30px'
                select(edgesMedium)
                break
            case 'big':
                doc.style.paddingInline = '50px'
                select(edgesBig)
        }
        switch (settingsData.font) {
            case 'noto':
                doc.style.fontFamily = "'Noto Sans', Roboto, sans-serif"
                select(fontNoto)
                break
            case 'roboto':
                doc.style.fontFamily = "Roboto, 'Noto Sans', sans-serif"
                select(fontRoboto)
                break
            case 'curved':
                doc.style.fontFamily = "Philosopher, 'Times New Roman', sans-serif"
                select(fontPhilosopher)
                break
            case 'times':
                doc.style.fontFamily = "'Times New Roman', Philosopher, sans-serif"
                select(fontTimes)
        }
        switch (settingsData.paragraph) {
            case 'off':
                doc.style.textIndent = ''
                select(paragraphOff)
                break
            case 'on':
                doc.style.textIndent = '25px'
                select(paragraphOn)
            
        }
        switch (settingsData.textAlign) {
            case 'left':
                doc.style.setProperty('--text-align', 'left')
                select(textAlignLeft)
                break
            case 'justify':
                doc.style.setProperty('--text-align', 'justify')
                select(textAlignJustify)
        }
        doc.style.setProperty('--font-size', settingsData.fontSize + 'px')
        fontSizeVal.innerText = settingsData.fontSize
        doc.style.setProperty('--line-height', settingsData.lineHeight)
        lineHeightVal.innerText = settingsData.lineHeight
        doc.style.setProperty('--line-margin', settingsData.lineMargin + 'em')
        lineMarginVal.innerText = settingsData.lineMargin
        doc.style.setProperty('--letter-space', settingsData.letterSpace + 'px')
        letterSpaceVal.innerText = settingsData.letterSpace
    }

    updateSettings()

    themeBlack.addEventListener('click', () => {
        localStorage.setItem('settings-theme', 'black')
        updateSettings()
    })
    themeWhite.addEventListener('click', () => {
        localStorage.setItem('settings-theme', 'white')
        updateSettings()
    })
    themePaper.addEventListener('click', () => {
        localStorage.setItem('settings-theme', 'paper')
        updateSettings()
    })
    pageSizeStandard.addEventListener('click', () => {
        localStorage.setItem('settings-pageSize', 'standard')
        updateSettings()
    })
    pageSize50.addEventListener('click', () => {
        localStorage.setItem('settings-pageSize', '50')
        updateSettings()
    })
    pageSize80.addEventListener('click', () => {
        localStorage.setItem('settings-pageSize', '80')
        updateSettings()
    })
    pageSize100.addEventListener('click', () => {
        localStorage.setItem('settings-pageSize', '100')
        updateSettings()
    })
    edgesSmall.addEventListener('click', () => {
        localStorage.setItem('settings-edges', 'small')
        updateSettings()
    })
    edgesMedium.addEventListener('click', () => {
        localStorage.setItem('settings-edges', 'medium')
        updateSettings()
    })
    edgesBig.addEventListener('click', () => {
        localStorage.setItem('settings-edges', 'big')
        updateSettings()
    })
    fontNoto.addEventListener('click', () => {
        localStorage.setItem('settings-font', 'noto')
        updateSettings()
    })
    fontRoboto.addEventListener('click', () => {
        localStorage.setItem('settings-font', 'roboto')
        updateSettings()
    })
    fontPhilosopher.addEventListener('click', () => {
        localStorage.setItem('settings-font', 'curved')
        updateSettings()
    })
    fontTimes.addEventListener('click', () => {
        localStorage.setItem('settings-font', 'times')
        updateSettings()
    })
    fontSizeDec.addEventListener('click', () => {
        let val = fontSizeVal.innerText*1
        const step = fontSizeVal.dataset.step*1
        if ((newVal = Math.round((val - step) * 100) / 100) >= fontSizeVal.dataset.min) val = newVal
        localStorage.setItem('settings-fontSize', val)
        updateSettings()
    })
    fontSizeInc.addEventListener('click', () => {
        let val = fontSizeVal.innerText*1
        const step = fontSizeVal.dataset.step*1
        if ((newVal = Math.round((val + step) * 100) / 100) <= fontSizeVal.dataset.max) val = newVal
        localStorage.setItem('settings-fontSize', val)
        updateSettings()
    })
    lineHeightDec.addEventListener('click', () => {
        let val = lineHeightVal.innerText*1
        const step = lineHeightVal.dataset.step*1
        if ((newVal = Math.round((val - step) * 100) / 100) >= lineHeightVal.dataset.min) val = newVal
        localStorage.setItem('settings-lineHeight', val)
        updateSettings()
    })
    lineHeightInc.addEventListener('click', () => {
        let val = lineHeightVal.innerText*1
        const step = lineHeightVal.dataset.step*1
        if ((newVal = Math.round((val + step) * 100) / 100) <= lineHeightVal.dataset.max) val = newVal
        localStorage.setItem('settings-lineHeight', val)
        updateSettings()
    })
    lineMarginDec.addEventListener('click', () => {
        let val = lineMarginVal.innerText*1
        const step = lineMarginVal.dataset.step*1
        if ((newVal = Math.round((val - step) * 100) / 100) >= lineMarginVal.dataset.min) val = newVal
        localStorage.setItem('settings-lineMargin', val)
        updateSettings()
    })
    lineMarginInc.addEventListener('click', () => {
        let val = lineMarginVal.innerText*1
        const step = lineMarginVal.dataset.step*1
        if ((newVal = Math.round((val + step) * 100) / 100) <= lineMarginVal.dataset.max) val = newVal
        localStorage.setItem('settings-lineMargin', val)
        updateSettings()
    })
    letterSpaceDec.addEventListener('click', () => {
        let val = letterSpaceVal.innerText*1
        const step = letterSpaceVal.dataset.step*1
        if ((newVal = Math.round((val - step) * 100) / 100) >= letterSpaceVal.dataset.min) val = newVal
        localStorage.setItem('settings-letterSpace', val)
        updateSettings()
    })
    letterSpaceInc.addEventListener('click', () => {
        let val = letterSpaceVal.innerText*1
        const step = letterSpaceVal.dataset.step*1
        if ((newVal = Math.round((val + step) * 100) / 100) <= letterSpaceVal.dataset.max) val = newVal
        localStorage.setItem('settings-letterSpace', val)
        updateSettings()
    })
    paragraphOn.addEventListener('click', () => {
        localStorage.setItem('settings-paragraph', 'on')
        updateSettings()
    })
    paragraphOff.addEventListener('click', () => {
        localStorage.setItem('settings-paragraph', 'off')
        updateSettings()
    })
    textAlignLeft.addEventListener('click', () => {
        localStorage.setItem('settings-text-align', 'left')
        updateSettings()
    })
    textAlignJustify.addEventListener('click', () => {
        localStorage.setItem('settings-text-align', 'justify')
        updateSettings()
    })

    //* Content loading

    const pageLoader = (title) => {
        const loadingScreen = document.querySelector('#loading-screen')
        const labelDiv = loadingScreen.querySelector('.label')
        loadingScreen.style.display = ''
        labelDiv.innerText = title ?? 'Будь ласка зачекайте, ми збираємо для вас сайт'
        let percent = 0
        let arr = []
        let arr4 = {}
        const ret = {
            add(name, ...promises) {
                let arr2 = promises.reduce((t, v) => (Array.isArray(v) ? [...t, ...v] : [...t, v]), [])
                let arr3 = [...arr, ...arr2]
                percent *= arr.length / arr3.length
                loadingScreen.style.setProperty('--percent', percent)
                arr = arr3
                if (name) arr4[name] = Array(arr2.length)
                arr2.map((v, i) => {
                    if (v) v.then(val => {
                        percent += 1 / arr.length
                        loadingScreen.style.setProperty('--percent', percent)
                        if (name) arr4[name][i] = val
                    })
                    else {
                        percent += 1 / arr.length
                        loadingScreen.style.setProperty('--percent', percent)
                        if (name) arr4[name][i] = null
                    }
                })
                return promises
            },
            release(func) {
                Promise.all(arr).then(() => {
                    loadingScreen.style.display = 'none'
                    func(arr4)
                })
            }
        }
        return ret
    }

    const createElement = (html) => {
        const tmp = document.createElement('template')
        tmp.innerHTML = html.trim()
        return tmp.content.firstChild
    }

    HTMLTextAreaElement.prototype.getFromCaret = function () {
        if (document.selection) {
            this.focus()
            return document.selection.createRange().text
        } else if (this.selectionStart?.valueOf) {
            return this.value.substring(this.selectionStart, this.selectionEnd)
        } else {
            return throws.value
        }
    }

    HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
        text = text ?? ''
        if (document.selection) {
            this.focus()
            var sel = document.selection.createRange()
            sel.text = text
        } else if (this.selectionStart?.valueOf) {
            this.value = this.value.substring(0, this.selectionStart) + text + this.value.substring(this.selectionEnd, this.value.length)
            this.selectionEnd = this.selectionStart + text.length
        } else {
            this.value += text
        }
    }

    Selection.prototype.serialize = function(parent) {
        if (this.type == 'Range' && parent.contains(this.anchorNode) && parent.contains(this.focusNode)){
            const search = (parent, node) => Array.from(parent.children).reduce((t, v, i) => t + (v.contains(node) ? i + (v.childElementCount > 0 ? '/' + search(v, node) : '') : ''), '')
            const start = search(parent, this.anchorNode)
            const end = search(parent, this.focusNode)
            return `${start}/${this.anchorOffset}|${end}/${this.focusOffset}`
        } else throw new Error('Cannot read selection')
    }

    Selection.prototype.deserialize = function(parent, str) {
        const startNode = str.split('|')[0].split('/')
        const endNode = str.split('|')[1].split('/')
        const startOffset = startNode.pop()
        const endOffset = endNode.pop()
        const range = document.createRange()
        range.setStart(startNode.reduce((t, v) => t.children[v], parent).childNodes[0], startOffset)
        range.setEnd(endNode.reduce((t, v) => t.children[v], parent).childNodes[0], endOffset)
        return range
    }

    const showMessage = (title, msg, icon, callback) => {
        message.querySelector('.title').innerText = title
        message.querySelector('.message').innerHTML = msg
        message.querySelector('.icon').innerHTML = icon ?? '&#xe90c;'
        messageClose.addEventListener('click', callback, { once: true })
        toggleModal('message')
    }
    const networkErr = err => showMessage('Помилка мережі', "Неможливо встановити зв'язок з сервером:\n" + err, '&#xe92b;')
    const invalidAddr = () => showMessage('Помилка', 'Неправильна адреса', '&#xe921;', () => { location = 'https://urepo.com.ua/bookreader' })
    
    const urlParams = new URLSearchParams(location.search)

    const bookId = urlParams.get('book')
    let bookPage = urlParams.get('page')

    const loader = pageLoader()
    loader.add('userId', fetch('https://server.urepo.com.ua:8443/userauth/check', {credentials:'include'}))
    loader.add('bookList', fetch('https://server.urepo.com.ua:8443/books', {credentials: 'include'}))
    loader.add('messages', fetch('https://server.urepo.com.ua:8443/user/messages', {credentials: 'include'}))
    loader.add('bookmarks', fetch('https://server.urepo.com.ua:8443/user/bookmarks', {credentials: 'include'}))

    // Page assembling

    loader.release(async ({userId, bookList, messages, bookmarks}) => {
        try {
            userId = await userId[0].text()
            bookList = await bookList[0].json()
            messages = await messages[0].json()
            bookmarks = await bookmarks[0].json()
        } catch (err) { return networkErr(err) }

        const userType = (userId == 'unautorized' ? '' : userId.split('#')[1])
        if (userId != 'unautorized') userId = userId.split('#')[0]

        history.replaceState(null, '', `/bookreader/?${urlParams}`)

        const updateComments = (comments, commentsLikes, sortFunc) => {
            commentsList.innerHTML = `<div class="controls"><div class="sortby">Сортувати:<span class="button">спочатку нові</span><span class="button">спочатку старі</span><span class="button">за рейтингом</span></div></div>`

            const [sortForNew, sortForOld, sortForRating] = commentsList.querySelectorAll('.sortby > span')

            sortForNew.addEventListener('click', () => updateComments(comments, commentsLikes, (a, b) => +new Date(a.date) < +new Date(b.date)))
            sortForOld.addEventListener('click', () => updateComments(comments, commentsLikes, (a, b) => +new Date(a.date) > +new Date(b.date)))
            sortForRating.addEventListener('click', () => updateComments(comments, commentsLikes, (a, b) => a.likes.likes < b.likes.likes))

            const respond = createElement(`<div class="new-respond">
                <div class="new-comment" style="display: grid">
                    <textarea type="text" rows="6" maxlength="4000" spellcheck="true"></textarea>
                    <div class="controls">
                        <div class="bold button" title="Виділення">&#xea62;</div>
                        <div class="italic button" title="Курсив">&#xea64;</div>
                        <div class="underline button" title="Підкреслений">&#xea63;</div>
                        <div class="delete button" title="Закреслений">&#xea65;</div>
                        <div class="spoiler button" title="Спойлер">&#xe911;</div>
                        <div class="link button" title="Посилання" style="font-size:18px">&#xe91b;</div>
                        <div class="send" title="Відправити">&#xe918;</div>
                    </div>
                </div>
                <div class="cancel button">Відмінити</div>
            </div>`)

            respond.querySelector('.cancel').onclick = () => respond.remove()
            respond.querySelector('textarea').addEventListener('input', e => {
                e.target.style.height = '0px'
                e.target.style.height = e.target.scrollHeight - 34 + 'px'
            })
            respond.querySelector('textarea').value = ''
    
            const addComments = (list, parent, iter) => {
                list.sort(sortFunc)
                for (const comment of list) {
                    let date
                    if (comment.edited) comment.date = comment.edited
                    date = new Date(comment.date)
                    date = date.toLocaleString('ua', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}) + (comment.edited ? ' ' : '')
                    let userType = '"'
                    switch (comment.userType) {
                        case 'A':
                            userType = ' administrator" title="Адміністратор"'
                            break
                        case 'M':
                            userType = ' moderator" title="Модератор"'
                            break
                        case 'P':
                            userType = ' premium" title="Преміум"'
                    }
                    const elem = createElement(`<div class="comment">
                        <div class="body">
                            <img class="picture" title="${comment.user}" src="${comment.picture}">
                            <div class="name${userType}>${comment.user.split('#')[0]}<span>#${comment.user.split('#')[1]}</span></div>
                            <div class="respond button" title="Відповісти">Відповісти</div>
                            <div class="date">${date}</div>
                            <div class="likes">
                                <div class="plus button">&#xf067;</div>
                                <div class="value">0</div>
                                <div class="minus button">&#xf068;</div>
                            </div>
                            <div class="menu">
                                <div class="dots"></div>
                                <div class="popup">
                                    <div class="report button">Поскаржитися</div>
                                </div>
                            </div>
                            <div class="text">${comment.text}</div>
                            <div class="text-expand">
                                <div> розгорнути </div>
                            </div>
                        </div>
                        <div class="footer none">
                            <div class="responses button"></div>
                            <div class="responses-list"></div>
                        </div>
                    </div>`)

                    elem.querySelector('.text-expand > div').addEventListener('click', () => {
                        elem.querySelector('.text-expand').style.display = 'none'
                        elem.querySelector('.text').style.maxHeight = 'none'
                    })

                    for (const quote of elem.querySelectorAll('.text .quote')) {
                        const range = document.getSelection().deserialize(doc, quote.innerText)
                        quote.dataset.range = quote.innerText
                        quote.innerText = range.toString()
                        quote.addEventListener('click', () => {
                            const sel = document.getSelection()
                            sel.removeAllRanges()
                            sel.addRange(range)
                            main.scroll({
                                behavior: 'smooth',
                                top: main.scrollTop + range.startContainer.parentElement.getBoundingClientRect().y - 200
                            })
                        })
                    }

                    {
                        const plus = elem.querySelector('.likes .plus')
                        const value = elem.querySelector('.likes .value')
                        const minus = elem.querySelector('.likes .minus')
                        comment.likes = commentsLikes.find(v => v.id == comment.id)
                        value.innerText = comment.likes.likes
                        if (comment.likes.likes > 0) value.style.color = 'lime'
                        else if (comment.likes.likes < 0) value.style.color = 'red'
                        if (comment.likes.state == 1) plus.classList.add('disabled')
                        else if (comment.likes.state == -1) minus.classList.add('disabled')
                        if (userId == 'unauthorized') {
                            plus.classList.add('disabled')
                            minus.classList.add('disabled')
                        }
                        plus.addEventListener('click', async () => {
                            try {
                                const newData = await (await fetch('https://server.urepo.com.ua:8443/books/comments/likes/' + comment.id, {
                                    method: 'PUT',
                                        credentials: 'include',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                        state: 1
                                    })
                                })).json()
                                Object.assign(comment.likes, newData)
                                value.innerText = comment.likes.likes
                                if (comment.likes.likes > 0) value.style.color = 'lime'
                                else if (comment.likes.likes == 0) value.style.color = ''
                                else if (comment.likes.likes < 0) value.style.color = 'red'
                                if (comment.likes.state == 0) minus.classList.remove('disabled')
                                else if (comment.likes.state == 1) plus.classList.add('disabled')
                            } catch (err) {
                                console.error(err)
                            }
                        })
                        minus.addEventListener('click', async () => {
                            try {
                                const newData = await (await fetch('https://server.urepo.com.ua:8443/books/comments/likes/' + comment.id, {
                                    method: 'PUT',
                                        credentials: 'include',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                        state: -1
                                    })
                                })).json()
                                Object.assign(comment.likes, newData)
                                value.innerText = comment.likes.likes
                                if (comment.likes.likes > 0) value.style.color = 'lime'
                                else if (comment.likes.likes == 0) value.style.color = ''
                                else if (comment.likes.likes < 0) value.style.color = 'red'
                                if (comment.likes.state == 0) plus.classList.remove('disabled')
                                else if (comment.likes.state == -1) minus.classList.add('disabled')
                            } catch (err) {
                                console.error(err)
                            }
                        })
                    }

                    for (const spoiler of elem.querySelectorAll('.spoiler')) {
                        spoiler.addEventListener('click', () => {
                            if (spoiler.classList.contains('show')) spoiler.classList.remove('show')
                            else spoiler.classList.add('show')
                        })
                    }

                    elem.querySelector('.respond').addEventListener('click', () => {
                        respond.querySelector('.send').onclick = async () => {
                            await fetch(`https://server.urepo.com.ua:8443/books/comments/${bookId}/${bookPage}`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({
                                    parent: comment.id,
                                    text: respond.querySelector('textarea').value
                                })
                            })
                            commentsLoad.click()
                        }
                        respond.querySelector('textarea').value = ''
                        respond.querySelector('textarea').placeholder = 'Додати відповідь'
                        elem.querySelector('.footer').insertBefore(respond, elem.querySelector('.footer .responses.button'))
                    })

                    if (comment.user.split('#')[1] == userId) {
                        const editComment = createElement('<div class="button">Редагувати</div>')
                        const deleteComment = createElement('<div class="button">Видалити</div>')
                        const popup = elem.querySelector('.menu .popup')

                        editComment.addEventListener('click', async () => {
                            respond.querySelector('.send').onclick = async () => {
                                await fetch(`https://server.urepo.com.ua:8443/books/comments/${bookId}/${bookPage}`, {
                                    method: 'PUT',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    body: JSON.stringify({
                                        id: comment.id,
                                        text: respond.querySelector('textarea').value
                                    })
                                })
                                commentsLoad.click()
                            }
                            const text = comment.text
                            .replaceAll('&lt;', '<').replaceAll('&gt;', '>')
                            .replace(/<b>(.*?)<\/b>/g, '[b]$1[/b]')
                            .replace(/<i>(.*?)<\/i>/g, '[i]$1[/i]')
                            .replace(/<u>(.*?)<\/u>/g, '[u]$1[/u]')
                            .replace(/<s>(.*?)<\/s>/g, '[s]$1[/s]')
                            .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[a="$1"]$2[/a]')
                            .replace(/<span class="spoiler" data-text="(.*?)">(.*?)<\/span>/g, '[spoiler="$1"]$2[/spoiler]')
                            .replace(/<div class="quote">(.*?)<\/div>/g, '[q]$1[/q]')
                            .replaceAll('<br/>', '\n')
                            respond.querySelector('textarea').value = text
                            respond.querySelector('textarea').placeholder = 'Редагувати коментар'
                            elem.querySelector('.footer').insertBefore(respond, elem.querySelector('.footer .responses.button'))
                        })

                        deleteComment.addEventListener('click', async () => {
                            await fetch(`https://server.urepo.com.ua:8443/books/comments/${comment.id}`, {method: 'DELETE', credentials: 'include'})
                            commentsLoad.click()
                        })

                        popup.addEventListener('click', e => e.stopPropagation())

                        popup.innerHTML = ''
                        popup.appendChild(editComment)
                        popup.appendChild(deleteComment)
                    }

                    if (userId == 'unauthorized') {
                        elem.querySelector('.menu').style.display = 'none'
                        elem.querySelector('.respond').style.display = 'none'
                    }

                    {
                        const menu = elem.querySelector('.menu')
                        const func1 = () => {
                            const popup = menu.querySelector('.popup')
                            const func2 = e => {
                                if (e && (e.target == menu || menu.contains(e.target))) return
                                popup.classList.remove('show')
                                menu.onclick = func1
                                window.removeEventListener('pointerdown', func2)
                            }
                            window.addEventListener('pointerdown', func2)

                            popup.classList.add('show')
                            menu.onclick = () => {
                                window.removeEventListener('pointerdown', func2)
                                func2()
                            }
                        }
                        menu.onclick = func1
                    }
    
                    if (comment.children) {
                        const recCount = arr => arr.reduce((t, v) => t + (v.children ? recCount(v.children) : 0) + 1, 0)
                        const footer = elem.querySelector('.footer')
                        footer.querySelector('.responses.button').dataset.responses = recCount(comment.children)
                        footer.classList.remove('none')
                        footer.classList.add('open')
                        if (iter > 0 && iter % 8 == 0) footer.querySelector('.responses-list').dataset.nested = 2
                        else if (iter > 0 && iter % 4 == 0) footer.querySelector('.responses-list').dataset.nested = 1
                        addComments(comment.children, footer.querySelector('.responses-list'), iter + 1)
                        elem.appendChild(footer)
                    }
    
                    parent.appendChild(elem)
                }
            }
    
            addComments(comments, commentsList, 1)
    
            for (const footer of commentsList.querySelectorAll(':scope > .comment > .footer')) {
                footer.classList.remove('open')
            }
            for (const footer of commentsList.querySelectorAll('.footer')) {
                footer.querySelector('.responses').addEventListener('click', () => {
                    if (footer.classList.contains('open')) footer.classList.remove('open')
                    else footer.classList.add('open')
                })
            }
        }

        const updateSuggestions = (suggestions, suggestionsLikes) => {
            suggestionsList.innerHTML = ''
    
            for (const suggestion of suggestions) {
                let userType = '"'
                switch (suggestion.userType) {
                    case 'A':
                        userType = ' administrator" title="Адміністратор"'
                        break
                    case 'M':
                        userType = ' moderator" title="Модератор"'
                }
                const elem = createElement(`<div class="suggestion">
                    <img class="picture" title="${suggestion.user}" src="${suggestion.picture}">
                    <div class="name${userType}>${suggestion.user.split('#')[0]}<span>#${suggestion.user.split('#')[1]}</span></div>
                    <div class="likes">
                        <div class="plus button">&#xf067;</div>
                        <div class="value">0</div>
                        <div class="minus button">&#xf068;</div>
                    </div>
                    <div class="fragment" data-location="${suggestion.fragment}"></div>
                    <div class="comment">${suggestion.comment}</div>
                </div>`)

                {
                    const fragment = elem.querySelector('.fragment')
                    const range = document.getSelection().deserialize(doc, suggestion.fragment)
                    fragment.innerText = range.toString()
                    fragment.addEventListener('click', () => {
                        const sel = document.getSelection()
                        sel.removeAllRanges()
                        sel.addRange(range)
                        main.scroll({
                            behavior: 'smooth',
                            top: main.scrollTop + range.startContainer.parentElement.getBoundingClientRect().y - 200
                        })
                    })
                }

                {
                    const plus = elem.querySelector('.likes .plus')
                    const value = elem.querySelector('.likes .value')
                    const minus = elem.querySelector('.likes .minus')
                    suggestion.likes = suggestionsLikes.find(v => v.id == suggestion.id)
                    value.innerText = suggestion.likes.likes
                    if (suggestion.likes.likes > 0) value.style.color = 'lime'
                    else if (suggestion.likes.likes < 0) value.style.color = 'red'
                    if (suggestion.likes.state == 1) plus.classList.add('disabled')
                    else if (suggestion.likes.state == -1) minus.classList.add('disabled')
                    if (userId == 'unauthorized') {
                        plus.classList.add('disabled')
                        minus.classList.add('disabled')
                    }
                    plus.addEventListener('click', async () => {
                        try {
                            const newData = await (await fetch('https://server.urepo.com.ua:8443/books/suggestions/likes/' + suggestion.id, {
                                method: 'PUT',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                    state: 1
                                })
                            })).json()
                            Object.assign(suggestion.likes, newData)
                            value.innerText = suggestion.likes.likes
                            if (suggestion.likes.likes > 0) value.style.color = 'lime'
                            else if (suggestion.likes.likes == 0) value.style.color = ''
                            else if (suggestion.likes.likes < 0) value.style.color = 'red'
                            if (suggestion.likes.state == 0) minus.classList.remove('disabled')
                            else if (suggestion.likes.state == 1) plus.classList.add('disabled')
                        } catch (err) {
                            console.error(err)
                        }
                    })
                    minus.addEventListener('click', async () => {
                        try {
                            const newData = await (await fetch('https://server.urepo.com.ua:8443/books/suggestions/likes/' + suggestion.id, {
                                method: 'PUT',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                    state: -1
                                })
                            })).json()
                            Object.assign(suggestion.likes, newData)
                            value.innerText = suggestion.likes.likes
                            if (suggestion.likes.likes > 0) value.style.color = 'lime'
                            else if (suggestion.likes.likes == 0) value.style.color = ''
                            else if (suggestion.likes.likes < 0) value.style.color = 'red'
                            if (suggestion.likes.state == 0) plus.classList.remove('disabled')
                            else if (suggestion.likes.state == -1) minus.classList.add('disabled')
                        } catch (err) {
                            console.error(err)
                        }
                    })
                }

                suggestionsList.appendChild(elem)
            }
        }
    
        {
            const textarea = commentsBlock.querySelector('.new-comment textarea')

            textarea.addEventListener('input', e => {
                e.target.style.height = '0px'
                e.target.style.height = e.target.scrollHeight - 34 + 'px'
            })
            textarea.value = ''

            commentsBlock.querySelector('.new-comment .bold').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                if (text.startsWith('[b]') && text.endsWith('[/b]')) {
                    textarea.insertAtCaret(text.substr(3, text.length - 7))
                } else {
                    textarea.insertAtCaret(`[b]${text}[/b]`)
                }
            })
            commentsBlock.querySelector('.new-comment .italic').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                if (text.startsWith('[i]') && text.endsWith('[/i]')) {
                    textarea.insertAtCaret(text.substr(3, text.length - 7))
                } else {
                    textarea.insertAtCaret(`[i]${text}[/i]`)
                }
            })
            commentsBlock.querySelector('.new-comment .underline').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                if (text.startsWith('[u]') && text.endsWith('[/u]')) {
                    textarea.insertAtCaret(text.substr(3, text.length - 7))
                } else {
                    textarea.insertAtCaret(`[u]${text}[/u]`)
                }
            })
            commentsBlock.querySelector('.new-comment .delete').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                if (text.startsWith('[s]') && text.endsWith('[/s]')) {
                    textarea.insertAtCaret(text.substr(3, text.length - 7))
                } else {
                    textarea.insertAtCaret(`[s]${text}[/s]`)
                }
            })
            commentsBlock.querySelector('.new-comment .spoiler').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                const arr = text.match(/^\[spoiler=".*?"\](.*)\[\/spoiler\]$/)
                if (arr) {
                    textarea.insertAtCaret(arr[1])
                } else {
                    textarea.insertAtCaret(`[spoiler="Спойлер"]${text}[/spoiler]`)
                }
            })
            commentsBlock.querySelector('.new-comment .link').addEventListener('click', async e => {
                e.stopPropagation()
                const text = textarea.getFromCaret()
                const arr = text.match(/^\[a=".*?"\](.*)\[\/a\]$/)
                if (arr) {
                    textarea.insertAtCaret(arr[1])
                } else {
                    textarea.insertAtCaret(`[a="посилання"]${text}[/a]`)
                }
            })
            commentsBlock.querySelector('.new-comment .send').addEventListener('click', async e => {
                e.stopPropagation()
                await fetch(`https://server.urepo.com.ua:8443/books/comments/${bookId}/${bookPage}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        parent: 0,
                        text: textarea.value.replace(/\[ *q *= *"(.*?)" *\](.*?)\[ *\/ *q *\]/g, '[q]$1[/q]')
                    })
                })
                textarea.value = ''
                commentsLoad.click()
            })
        }
    
        commentsLoad.addEventListener('click', () => {
            const loader = pageLoader('Коментарі завантажуються')
            loader.add('comments', fetch(`https://server.urepo.com.ua:8443/books/comments/${bookId}/${bookPage}`))
            loader.add('commentsLikes', fetch(`https://server.urepo.com.ua:8443/books/comments/likes/${bookId}/${bookPage}`, {credentials: 'include'}))
    
            loader.release(async ({comments, commentsLikes}) => {
                try {
                    comments = await comments[0].json()
                    commentsLikes = await commentsLikes[0].json()
                } catch (err) { return networkErr(err) }
    
                updateComments(comments, commentsLikes, (a, b) => +new Date(a.date ?? a.edited) < +new Date(b.date ?? b.edited))
    
                commentsLoad.style.display = 'none'
                commentsList.style.display = 'flex'
            })
        })

        suggestionsLoad.addEventListener('click', () => {
            const loader = pageLoader('Правки завантажуються')
            loader.add('suggestions', fetch(`https://server.urepo.com.ua:8443/books/suggestions/${bookId}/${bookPage}`))
            loader.add('suggestionsLikes', fetch(`https://server.urepo.com.ua:8443/books/suggestions/likes/${bookId}/${bookPage}`, {credentials: 'include'}))
    
            loader.release(async ({suggestions, suggestionsLikes}) => {
                try {
                    suggestions = await suggestions[0].json()
                    suggestionsLikes = await suggestionsLikes[0].json()
                } catch (err) { return networkErr(err) }
    
                updateSuggestions(suggestions, suggestionsLikes)
    
                suggestionsLoad.style.display = 'none'
                suggestionsList.style.display = 'flex'
            })
        })

        const eName = (/safari/.test(navigator.userAgent.toLowerCase()) ? 'pointerdown' : 'click')

        quoteButton.addEventListener(eName, () => {
            commentsLoad.click()
            const sel = document.getSelection()
            const range = sel.getRangeAt(0)
            mainSelector.children[0].click()
            main.scroll({
                behavior: 'smooth',
                top: main.scrollTop + mainSelector.getBoundingClientRect().y
            })
            commentNew.querySelector('textarea').value += `[u="${sel.serialize(doc)}"]${range.toString()}[/u]`
        })

        suggestButton.addEventListener(eName, () => {
            suggestionsLoad.click()
            const sel = document.getSelection()
            const range = sel.getRangeAt(0)
            const fragment = sel.serialize(doc)
            const text = suggestionNew.querySelector('textarea')
            text.innerHTML = ''
            suggestionNew.querySelector('textarea').innerHTML = ''
            suggestionNew.querySelector('.text').innerText = range.toString()
            suggestionNew.querySelector('.send').onclick = async () => {
                await fetch(`https://server.urepo.com.ua:8443/books/suggestions/${bookId}/${bookPage}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        fragment,
                        comment: text.value
                    })
                })
                suggestionNew.style.display = ''
            }
            mainSelector.children[1].click()
            main.scroll({
                behavior: 'smooth',
                top: main.scrollTop + mainSelector.getBoundingClientRect().y
            })
            suggestionNew.style.display = 'block'
        })
        suggestionNew.querySelector('.cancel').onclick = () => {
            suggestionNew.style.display = ''
        }

        mainSelector.children[0].addEventListener('click', () => {
            suggestionsBlock.style.display = ''
            commentsBlock.style.display = 'flex'
            if (!mainSelector.children[0].classList.contains('selected')) {
                Array.from(mainSelector.children).forEach(v => v.classList.remove('selected'))
                mainSelector.children[0].classList.add('selected')
            }
        })
        mainSelector.children[1].addEventListener('click', () => {
            suggestionsBlock.style.display = 'flex'
            commentsBlock.style.display = ''
            if (!mainSelector.children[1].classList.contains('selected')) {
                Array.from(mainSelector.children).forEach(v => v.classList.remove('selected'))
                mainSelector.children[1].classList.add('selected')
            }
        })

        mainSelector.children[0].click()

        const updateMessages = () => {
            messages.sort((a, b) => (+new Date(a.received) < +new Date(b.received)))

            inboxPopup.innerText = ''

            for (const message of messages) {
                if (message.received) continue
                let from = message.from
                let href = ''
                if (from == 'server') from = 'Сервер'
                else href = ` href="https://server.urepo.com.ua:8443/user/profile/${from.split('#')[0]}"`
    
                const body = createElement(`<div class="message"></div>`)
                const close = createElement(`<div class="button close">×</div>`)
                const sender = createElement(`<a class="sender"${href}>${from}</a>`)
                const text = createElement(`<div class="text">${message.text}</div>`)
    
                close.addEventListener('click', async () => {
                    await fetch('https://server.urepo.com.ua:8443/user/messages/' + message.id, {credentials: 'include'})
                    message.received = Date.now()
                    updateMessages()
                })
    
                body.appendChild(close)
                body.appendChild(sender)
                body.appendChild(text)
                inboxPopup.appendChild(body)
            }

            if (inboxPopup.innerText == '') {
                inboxPopup.innerText = 'Тут наразі пусто.'
                inboxButton.innerText = ''
                inboxButton.classList.remove('subdigit')
            } else {
                inboxButton.classList.add('subdigit')
                const digit = inboxPopup.childElementCount
                inboxButton.dataset.subdigit = (digit < 100 ? digit : '∞')
            }
        }
        updateMessages()

        const loader = pageLoader()

        if (userId == 'unauthorized') {
            if (urlParams.get('cookies') == 'set') {
                showMessage('Помилка', 'Ваш браузер блокує міжсайтові куки.\nБудь-ласка, вимкніть цю функцію.', '&#xe908;')
            }
            profileButton.innerHTML = '&#xea8a;'
            profileButton.addEventListener('click', () => {
                location = 'https://server.urepo.com.ua:8443/userauth/auth?address=' + encodeURIComponent(location)
            })
        } else {
            profile = await (await loader.add('profile', fetch('https://server.urepo.com.ua:8443/user/profile/' + userId, {credentials: 'include'}))[0]).json().catch(networkErr)
            if (!profile) return
            profileButton.innerHTML = `<img src="${profile.picture}" style="border-radius:50%;height:30px;margin-top:5px">`
            profileButton.addEventListener('click', () => showMessage('', `Привіт, ${profile.name}!`, '&#xe9e9;'))
        }

        urlParams.delete('cookies')

        Array.from(document.querySelectorAll('img[data-src]')).map(img => {
            img.src = img.dataset.src
            delete img.dataset.src
            loader.add(null, new Promise(res => img.addEventListener('load', res)))
        })
    
        const selectChapter = (elem) => {
            for (const child of chapterList.children) {
                if (child == elem) child.classList.add('selected')
                else child.classList.remove('selected')
            }
        }

        if (!bookmarks.unautorized) bookmarks = bookmarks.map(v => {v.state = 'ready'; return v})

        const updateBookmarks = (bookmarks.unautorized ? () => {
            leftPadBookmarks.classList.remove('meta')
            leftPadSubPanel.classList.add('disabled')
            showMessage('Авторизуйтесь', 'Щоб мати змогу додавати закладки, вам потрібно ввійти в свій акаунт або створити новий.')
        } : () => {
            leftPadSubPanel.innerHTML = ''

            for (const item of bookmarks) {
                if (item.state == 'ready') {
                    const body = createElement('<div class="item"></div>')
                    const left = createElement(`<div class="left button"><div class="title">${item.title}</div><div class="path">${item.path}</div></div>`)
                    const right = createElement('<div class="right"></div>')
                    const del = createElement('<div class="button">&#xe9ac;</div>')
                    const edit = createElement('<div class="button">&#xf040;</div>')

                    left.addEventListener('click', () => {
                        location = 'https://urepo.com.ua/bookreader/?' + item.params
                    })
                    del.addEventListener('click', () => {
                        bookmarks.splice(bookmarks.indexOf(item), 1)
                        updateBookmarks()
                        fetch('https://server.urepo.com.ua:8443/user/bookmarks', {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            body: JSON.stringify({
                                id: item.id
                            })
                        })
                    })
                    edit.addEventListener('click', () => {
                        if (!bookmarks.find(v => v.state == 'edit')) {
                            item.state = 'edit'
                            updateBookmarks()
                        } else {
                            console.log('Wrong!')
                        }
                    })

                    right.appendChild(del)
                    right.appendChild(edit)
                    body.appendChild(left)
                    body.appendChild(right)
                    leftPadSubPanel.appendChild(body)
                } else if (item.state == 'edit') {
                    const body = createElement('<div class="item"></div>')
                    const left = createElement(`<div class="left"><div class="path">${item.path}</div></div>`)
                    const title = createElement('<input class="title" type="text" maxlength="18">')
                    const right = createElement('<div class="right"></div>')
                    const cancel = createElement('<div class="button">&#xf00d;</div>')
                    const confirm = createElement('<div class="button">&#xf00c;</div>')

                    title.value = item.title
                    
                    title.addEventListener("keyup", e => {
                        if (e.code == 'Enter') confirm.click()
                    })
                    cancel.addEventListener('click', () => {
                        if (item.title == '') bookmarks.splice(bookmarks.indexOf(item), 1)
                        else item.state = 'ready'
                        updateBookmarks()
                    })
                    confirm.addEventListener('click', () => {
                        if (title.value == '') {
                            bookmarks.splice(bookmarks.indexOf(item), 1)
                            fetch('https://server.urepo.com.ua:8443/user/bookmarks', {
                                method: 'DELETE',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({
                                    id: item.id
                                })
                            })
                        } else {
                            if (item.title != '') fetch('https://server.urepo.com.ua:8443/user/bookmarks', {
                                method: 'PUT',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({
                                    title: title.value,
                                    id: item.id
                                })
                            })
                            else fetch('https://server.urepo.com.ua:8443/user/bookmarks', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({
                                    title: title.value,
                                    path: item.path
                                })
                            }).then(r => r.json()).then(v => {
                                item.id = v.id
                                item.params = `book=${bookId}&page=${bookPage}`
                            })
                            item.title = title.value
                            item.state = 'ready'
                        }
                        updateBookmarks()
                    })

                    left.insertBefore(title, left.children[0])
                    right.appendChild(cancel)
                    right.appendChild(confirm)
                    body.appendChild(left)
                    body.appendChild(right)
                    leftPadSubPanel.appendChild(body)

                    title.focus()
                }
            }

            if (!((bookId && bookPage) || bookmarks[0])) {
                leftPadBookmarks.classList.remove('meta')
                leftPadSubPanel.classList.add('disabled')
                return showMessage('В закладках пусто', 'Перейдіть на сторінку книжки, щоб мати змогу додати закладку.')
            }

            if (!bookmarks.find(v => v.state == 'edit')) {
                const add = createElement('<div class="item button">&#xf067;</div>')

                add.addEventListener('click', () => {
                    bookmarks.push({
                        state: 'edit',
                        title: '',
                        path: `${titles.children[0].innerText}/${titles.children[1].innerText}/Стор. ${bookPage}`
                    })
                    updateBookmarks()
                })

                leftPadSubPanel.appendChild(add)
            }
        })

        leftPadBookmarks.addEventListener('click', () => {
            if (leftPadBookmarks.classList.contains('meta')) {
                leftPadBookmarks.classList.remove('meta')
                leftPadSubPanel.classList.add('disabled')
            } else {
                leftPadBookmarks.classList.add('meta')
                leftPadSubPanel.classList.remove('disabled')
            }
            updateBookmarks()
        })
    
        if (bookId && bookPage) {
            const series = Object.values(bookList).find(serie => serie.books.find(book => book.id == bookId))
            if (!series) return loader.release(invalidAddr)
            const book = series.books.find(book => book.id == bookId)
            if (!book) return loader.release(invalidAddr)

            document.body.classList.add('page-reader')

            const pages = await loader.add(null, new Promise(res => {
                const pages = {}
                
                const request = indexedDB.open('bookreader')

                request.onupgradeneeded = () => request.result
                .createObjectStore('pages', { keyPath: ['id', 'index'] })
                .createIndex('id-index', ['id', 'index'], { unique: true })

                request.onsuccess = () => {
                    const objectStore = request.result.transaction('pages', 'readwrite').objectStore('pages')

                    objectStore.getAllKeys().onsuccess = e => {
                        const promises = []
                        for (const key of e.target.result.filter(v => v[0] == bookId)) {
                            promises.push(new Promise(res => {
                                objectStore.get(key).onsuccess = e => {
                                    pages[e.target.result.text[0]] = e.target.result.version
                                    res()
                                }
                            }))
                        }
                        Promise.all(promises).then(() => res(pages))
                    }
                }
            }))[0]

            loader.add('pages', fetch('https://server.urepo.com.ua:8443/books/' + bookId, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(pages)
            }))

            loader.release(async ({pages}) => {
                try {
                    pages = await pages[0].json()
                } catch (err) { return networkErr(err) }

                await new Promise(res => {
                    indexedDB.open('bookreader').onsuccess = e => {
                        const os = e.target.result
                        .transaction('pages', 'readwrite').objectStore('pages')
                    
                        for (const page of pages) {
                            os.put({
                                id: bookId,
                                index: book.pages[page[0]][0],
                                version: book.pages[page[0]][1],
                                text: page,
                            })
                        }

                        pages = []
                        const promises = []
                        for (const page of Object.values(book.pages)) {
                            promises.push(new Promise(res => {
                                os.get([bookId, page[0]]).onsuccess = e => {
                                    pages.push(e.target.result.text)
                                    res()
                                }
                            }))
                        }
                        Promise.all(promises).then(() => res(pages))
                    }
                })
    
                const updatePage = () => {
                    const pageName = Object.entries(book.pages).find(([,v]) => v[0] == bookPage)?.[0]
                    const page = pages.find(page => page[0] == pageName)
                    if (!page) {
                        invalidAddr()
                        return true
                    }
    
                    for (const elem of chapterList.children) if (elem.innerText == pageName) {
                        selectChapter(elem)
                        break
                    }

                    commentsLoad.style.display = ''
                    commentsList.style.display = ''
                    suggestionsLoad.style.display = ''
                    suggestionsList.style.display = ''
                    suggestionNew.style.display = ''

                    if (userId == 'unauthorized') {
                        commentNew.style.display = 'none'
                        suggestButton.style.display = 'none'
                    }
                    if (userType == 'M' || userType == 'A') suggestButton.style.display = 'block'

                    const arrows = createElement('<div class="arrows"></div>')
                    const arrowLeft = createElement('<div class="button arrow left" title="Попередня сторінка">&#xf053;</div>')
                    arrows.appendChild(arrowLeft)
                    const arrowRight = createElement('<div class="button arrow right" title="Наступна сторінка">&#xf054;</div>')
                    arrows.appendChild(arrowRight)
                    doc.innerHTML = `<h1>${pageName}</h1><p>${page.filter((v, i) => i > 0).join('</p><p>')}</p>`
                    doc.appendChild(arrows)
                    title.innerText = pageName
    
                    const prevPage = Object.entries(book.pages).reduce((t, v) => (v[1][0] < bookPage && v[1][0] > t ? v[1][0] : t), -Infinity)
                    if (Number.isFinite(prevPage)) {
                        const toPrev = () => {
                            urlParams.set('page', prevPage)
                            history.replaceState(null, '', `/bookreader/?${urlParams}`)
                            bookPage = prevPage
                            if (updatePage()) return true
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
    
                    const nextPage = Object.entries(book.pages).reduce((t, v) => (v[1][0] > bookPage && v[1][0] < t ? v[1][0] : t), Infinity)
                    if (Number.isFinite(nextPage)) {
                        const toNext = () => {
                            urlParams.set('page', nextPage)
                            history.replaceState(null, '', `/bookreader/?${urlParams}`)
                            bookPage = nextPage
                            if (updatePage()) return true
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
                        main.scrollTop = localStorage.getItem(`scroll-${bookId}-${bookPage}`) ?? 0
                    }, 200)
                    localStorage.setItem('lastVisited', location.href)
                }

                document.addEventListener('selectionchange', () => {
                    const sel = document.getSelection()
                    if (sel.type == 'Range' && doc.contains(sel.anchorNode) && doc.contains(sel.focusNode)){
                        upperPopup.classList.add('show')
                    } else upperPopup.classList.remove('show')
                })

                {
                    chapterList.innerHTML = ''
                    for (const page of Object.entries(book.pages).sort(([,v1], [,v2]) => v1[0] > v2[0]).map(v => [v[0], v[1][0]])) {
                        const elem = createElement(`<div class="button text">${page[0]}</div>`)
                        elem.addEventListener('click', () => {
                            selectChapter(elem)
                            urlParams.set('page', page[1])
                            history.replaceState(null, '', `/bookreader/?${urlParams}`)
                            bookPage = page[1]
                            updatePage()
                        })
                        chapterList.appendChild(elem)
                    }
                }
                
                if (updatePage()) return
                titles.addEventListener('click', () => {
                    urlParams.delete('page')
                    location = 'https://urepo.com.ua/bookreader/?' + urlParams
                })
                titles.children[0].innerHTML = series.smallTitle
                titles.children[1].innerHTML = book.smallTitle
                
                //* Scroll
                
                const headerHeight = document.querySelector('header').getBoundingClientRect().height
                let scrollBacktrack = 0
                let scrollTicking = false
                let scrollAtTop = true
                let scrollAtBot = false
                main.addEventListener('scroll', () => {
                    if (!scrollTicking) requestAnimationFrame(() => {
                        const scrollTop = Math.max(0, main.scrollTop)
                        const diff = scrollTop - scrollBacktrack
                        if (diff > 0 && scrollAtTop) scrollAtTop = false
                        if (diff < headerHeight && scrollAtBot) scrollAtBot = false
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
                        } else scrollBacktrack = scrollTop - (scrollAtTop ? 0 : headerHeight)
                        scrollTicking = false
                    })
                    scrollTicking = true
                })
                setInterval(() => {
                    localStorage.setItem(`scroll-${bookId}-${bookPage}`, main.scrollTop)
                }, 200)

                mainFooter.style.opacity = 1
            })
        } else if (bookId) {
            const series = Object.values(bookList).find(serie => serie.books.find(book => book.id == bookId))
            if (!series) return loader.release(invalidAddr)
            const bookData = series.books.find(book => book.id == bookId)
    
            document.body.classList.add('page-title')
    
            description.querySelector('.title').innerText = series.title
            description.querySelector('.subtitle').innerText = bookData.title
            description.querySelector('.author').innerHTML = bookData.authors.map(v => {
                const [name, uid] = v.split('#')
                const href = `https://server.urepo.com.ua:8443/user/profile/${uid}`
                return `<a${href ? ` target="_blank" href="${href}"` : ''}>${name}</a>`
            }).join(', ')
            const descImg = description.querySelector('.picture img')
            descImg.src = 'https://server.urepo.com.ua:8443/books/image/' + bookId
            loader.add(null, new Promise(res => descImg.addEventListener('load', res)))

            const {state, likes: likesCount} = (await (await fetch('https://server.urepo.com.ua:8443/books/likes/' + bookId, { credentials: 'include' })).json())
            likes.innerText = likesCount
            if (state == 1) likes.classList.add('checked')
            const continueBtn = description.querySelector('.continue')
            if (Object.keys(bookData.pages).length) {
                if (href = localStorage.getItem('lastVisited')) {
                    continueBtn.innerText = 'Продовжити читання'
                    continueBtn.addEventListener('click', () => {
                        location = href
                    })
                } else {
                    continueBtn.innerText = 'Читати онлайн'
                    continueBtn.addEventListener('click', () => {
                        urlParams.set('page', Object.values(bookData.pages).reduce((t, v) => (v[0] < t ? v[0] : t), Infinity))
                        location = 'https://urepo.com.ua/bookreader/?' + urlParams
                    })
                }
            } else {
                continueBtn.innerText = 'В розробці'
                continueBtn.classList.add('disabled')
            }
            description.querySelector('.genre').innerHTML = bookData.genre.map(v => `<span>${v}</span>`).join('')
            description.querySelector('.pair[data-key="Дата виходу:"]').innerText = bookData.release
            description.querySelector('.pair[data-key="Розділів:"]').innerText = Object.keys(bookData.pages).length
            description.querySelector('.text').innerText = bookData.description
            {
                const chaptersList = description.querySelector('.chapter-list')
                chaptersList.innerHTML = ''
                const pages = Object.entries(bookData.pages).sort(([,v1], [,v2]) => v1[0] > v2[0]).map(v => [v[0], v[1][0]])
                for (const page of pages) {
                    const elem = createElement(`<div class="button text">${page[0]}</div>`)
                    elem.addEventListener('click', () => {
                        urlParams.set('page', page[1])
                        location = 'https://urepo.com.ua/bookreader/?' + urlParams
                    })
                    chaptersList.appendChild(elem)
                }
            }
    
            likes.oncontextmenu = e => {e.preventDefault()}
            bell.oncontextmenu = e => {e.preventDefault()}
            mark.oncontextmenu = e => {e.preventDefault()}
    
            if (state != -1) likes.addEventListener('click', async () => {
                const {state, likes: likesCount} = (await (await fetch('https://server.urepo.com.ua:8443/books/likes/' + bookId, {
                    method: 'PUT',
                    credentials: 'include'
                })).json())
                likes.innerText = likesCount
                if (state == 1) likes.classList.add('checked')
                if (state == 0) likes.classList.remove('checked')
            })
            else likes.addEventListener('click', () => showMessage('Увага', 'Лише авторизовані користувачі можуть виставляти рейтинг.', ''))
            let f2 = false
            bell.addEventListener('click', () => {
                if (f2) {
                    bell.innerText = ''
                } else {
                    bell.innerText = ''
                }
                f2 = !f2
            })
            let f3 = false
            mark.addEventListener('click', () => {
                if (f3) {
                    mark.innerText = ''
                } else {
                    mark.innerText = ''
                }
                f3 = !f3
            })

            loader.release(() => {
                description.style.opacity = 1
            })
        } else {
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
                            <div class="contents">${bookList[series].books.map(book => `<img src="https://server.urepo.com.ua:8443/books/image/${book.id}">`)}</div>
                            <div class="selector"></div>
                        </div>
                        <div class="arrow right disabled">&#xf054;</div>
                    </div>
                </div>`)
                bookIndex.appendChild(bookbox)
            }
    
            Array.from(document.querySelectorAll('img[data-src]')).map(img => {
                img.src = img.dataset.src
                delete img.dataset.src
                loader.add(null, new Promise(res => img.addEventListener('load', res)))
            })
    
            Array.from(document.querySelectorAll('.bookbox')).map(bookbox => new Promise(res => {
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
    
                const expand = v => {
                    if (v ?? overview.classList.contains('collapsed')) {
                        overview.classList.remove('collapsed')
                        expander.classList.add('open')
                    } else {
                        overview.classList.add('collapsed')
                        expander.classList.remove('open')
                    }
                }
    
                arrowLeft.addEventListener('click', e => {
                    const pos = gallery.style.getPropertyValue('--pos') - 1
                    arrowRight.classList.remove('disabled')
                    if (!pos) arrowLeft.classList.add('disabled')
                    gallery.style.setProperty('--pos', pos)
                })
                arrowRight.addEventListener('click', e => {
                    const pos = gallery.style.getPropertyValue('--pos') * 1 + 1
                    arrowLeft.classList.remove('disabled')
                    if (pos == maxGalPos) arrowRight.classList.add('disabled')
                    gallery.style.setProperty('--pos', pos)
                })
                header.addEventListener('click', () => expand())

                description.onpointerdown = () => {
                    const func = e => {
                        if (e.target != description) {
                            description.classList.remove('hover')
                            window.removeEventListener('pointerdown', func)
                            description.removeEventListener('mouseout', func)
                        }
                    }
                    window.addEventListener('pointerdown', func)
                    description.addEventListener('mouseout', func)

                    description.classList.add('hover')
                }
    
                scroll.addEventListener('touchstart', e => {
                    Array.from(e.changedTouches).map(v => ongoingTouches.push({
                        id: v.identifier,
                        x: v.pageX,
                        y: v.pageY
                    }))
                })
                scroll.addEventListener('touchend', e => {
                    Array.from(e.changedTouches).map(v => {
                        const i = ongoingTouches.findIndex(t => t.id == v.identifier)
                        if (i != -1) {
                            if (lockedY) null
                            else if (!arrowRight.classList.contains('disabled') && ongoingTouches[i].x - v.pageX > 50) arrowRight.click()
                            else if (!arrowLeft.classList.contains('disabled') && ongoingTouches[i].x - v.pageX < -50) arrowLeft.click()
                            ongoingTouches.splice(i, 1)
                        }
                    })
                    lockedX = 0
                    lockedY = 0
                })
                scroll.addEventListener('touchmove', e => {
                    Array.from(e.changedTouches).map(v => {
                        const i = ongoingTouches.findIndex(t => t.id == v.identifier)
                        if (i != -1) {
                            if (!lockedY && (ongoingTouches[i].x - v.pageX > 10 || ongoingTouches[i].x - v.pageX < -10)) lockedX = 1
                            else if (!lockedX && (ongoingTouches[i].y - v.pageY > 10 || ongoingTouches[i].y - v.pageY < -10)) lockedY = 1
                        }
                    })
                    if (lockedX) e.preventDefault()
                })
    
                {
                    let list = []
    
                    const adjust = () => {
                        const margin = (scrollWidth - (list.reduce((t, v) => t + v.width, 0) + (list.length - 1) * 20)) / (list.length + 1)
                        list[0].style.setProperty('--mar-left', margin / scrollWidth)
                        list[list.length - 1].style.setProperty('--mar-right', margin / scrollWidth)
                        for (const elem of list) {
                            if (list[0] != elem) elem.style.setProperty('--mar-left', (margin + 20) / scrollWidth)
                        }
                    }
    
                    const select = img => {
                        selector.style.setProperty('--elem-width', img.getBoundingClientRect().width / scrollWidth)
                        selector.style.setProperty('--elem-margin', (gallery.style.getPropertyValue('--pos') * scroll.getBoundingClientRect().width + img.getBoundingClientRect().x - arrowLeft.getBoundingClientRect().width - arrowLeft.getBoundingClientRect().x) / scrollWidth)
                        overviewImg.src = img.src
                        overviewImg.onclick = () => {
                            location = 'https://urepo.com.ua/bookreader/?book=' + img.src.split('/').pop()
                        }
                        selected = img
                        const series = Object.values(bookList).find(serie => serie.books.find(book => book.id == img.src.split('/').pop()))
                        const book = series.books.find(book => book.id == img.src.split('/').pop())
                        description.innerText = book.description
                    }

                    let f = false
                    let int = 0
                    overviewStart.addEventListener('mouseover', () => {int = setTimeout(() => {f = true}, 100)})
                    overviewStart.addEventListener('mouseout', () => {
                        clearTimeout(int)
                        f = false
                    })
                    overviewStart.addEventListener('mousedown', () => {if (f) overviewImg.click()})
    
                    const imgPromises = Array.from(contents.children).map(v => (v.complete ? null : new Promise(res => v.addEventListener('load', res))))
    
                    loader.add(null, imgPromises)
    
                    Promise.all(imgPromises).then(() => {
                        for (const img of contents.children) {
                            if (list.reduce((t, v) => t + v.width, 0) + img.width + list.length * 20 <= scrollWidth) list.push(img)
                            else {
                                maxGalPos++
                                adjust()
                                list = [img]
                            }
                            img.addEventListener('click', () => {
                                if (selected == img) {
                                    overviewStart.style.pointerEvents = 'none'
                                    overviewStart.style.opacity = 1
                                    setTimeout(() => {
                                        overviewStart.style.pointerEvents = ''
                                        overviewStart.style.opacity = ''
                                    }, 600)
                                }
                                description.classList.add('disabled')
                                setTimeout(() => {
                                    description.addEventListener('mouseout', () => {
                                        description.classList.remove('disabled')
                                    }, { once: true })
                                    description.addEventListener('mouseover', () => {
                                        description.classList.remove('disabled')
                                    }, { once: true })
                                }, 200)
                                select(img)
                                expand(1)
                            })
                        }
                        adjust()
                        select(contents.children[0])
                        if (maxGalPos > 0) arrowRight.classList.remove('disabled')
                        res()
                    })
                }
            }))

            loader.release(() => {
                bookIndex.style.opacity = 1
            })
        }
    })
})()