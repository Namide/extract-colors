function getListOfData (selector: string, dataLabel: string) {
  return [...document.body.querySelectorAll(selector)].reduce((list, el) => {
    const name = (el as HTMLElement).dataset[dataLabel] as string
    if (name && list.indexOf(name) > -1) {
      return list
    }
    return [...list, name]
  }, [] as string[])
}

getListOfData("*[data-tab]", "tab").forEach(tabName => {
  const nums = getListOfData(`*[data-tab="${ tabName }"][data-tabbtn]`, "tabbtn")
  nums.forEach(selectedNum => {
    document.body.querySelector(`*[data-tab="${ tabName }"][data-tabbtn="${ selectedNum }"]`)
      ?.addEventListener("click", () => {
        document.body.querySelector(`*[data-tab="${ tabName }"][data-tabbtn="${ selectedNum }"]`)
          ?.classList.add('!bg-neutral', '!text-neutral-content', 'tab-active')
        document.body.querySelector(`*[data-tab="${ tabName }"][data-tabcontent="${ selectedNum }"]`)
          ?.classList.remove('!hidden')

        nums.filter(unselectedNum => unselectedNum !== selectedNum).forEach(unselectedNum => {
          document.body.querySelector(`*[data-tab="${ tabName }"][data-tabbtn="${ unselectedNum }"]`)
            ?.classList.remove('!bg-neutral', '!text-neutral-content', 'tab-active')
          document.body.querySelector(`*[data-tab="${ tabName }"][data-tabcontent="${ unselectedNum }"]`)
            ?.classList.add('!hidden')
        })
      })
  })
})
