const BASE_URL = 'https://rickandmortyapi.com/api'
const CHARACTER_IDS = [263, 397, 522, 660, 670, 766]

const list = document.querySelector(".list");
const message = document.querySelector(".message");

function createLink(url) {
    const link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    return link
}

function createInfoBlock(label, value, url) {
    const block = document.createElement("div")
    const labelText = document.createElement("p")
    labelText.className = "label"
    labelText.textContent = label

    // у неизвестной локации в API нет ссылки
    const valueText = url ? createLink(url) : document.createElement("span")
    valueText.className = "value"
    valueText.textContent = value

    block.append(labelText, valueText)
    return block
}

function render(characters, episodes) {
    list.innerHTML = ""
    message.textContent = ""

    characters.forEach(item => {
        const li = document.createElement("li");
        li.className = "card"

        const img = document.createElement("img")
        img.src = item.image
        img.alt = item.name

        const info = document.createElement("div")
        info.className = "info"

        const nameLink = createLink(item.url)
        const name = document.createElement("h2")
        name.textContent = item.name
        nameLink.append(name)

        const status = document.createElement("p")
        status.className = "status"
        const dot = document.createElement("span")
        dot.className = "dot " + item.status.toLowerCase()
        const statusText = document.createElement("span")
        statusText.textContent = item.status + " - " + item.species
        status.append(dot, statusText)

        const heading = document.createElement("div")
        heading.append(nameLink, status)

        const episodeUrl = item.episode[0]
        const location = createInfoBlock("Last known location:", item.location.name, item.location.url)
        const firstSeen = createInfoBlock("First seen in:", episodes[getIdFromUrl(episodeUrl)], episodeUrl)

        info.append(heading, location, firstSeen)
        li.append(img, info)
        list.append(li)
    })
}

function getIdFromUrl(url) {
    return url.split("/").pop()
}

function getJson(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Request failed: " + response.status)
        }
        return response.json()
    })
}

function getEpisodes(characters) {
    const ids = [...new Set(characters.map(item => getIdFromUrl(item.episode[0])))]

    return getJson(BASE_URL + '/episode/' + ids)
        .then(data => {
            // для одного id API возвращает объект, а не массив
            const episodes = {}
            const items = Array.isArray(data) ? data : [data]
            items.forEach(item => {
                episodes[item.id] = item.name
            })
            return episodes
        })
}

function getAlldata() {
    getJson(BASE_URL + '/character/' + CHARACTER_IDS)
        .then(characters => getEpisodes(characters)
            .then(episodes => render(characters, episodes)))
        .catch(() => {
            message.textContent = "Не удалось загрузить персонажей. Попробуйте обновить страницу."
        })
}
getAlldata()
