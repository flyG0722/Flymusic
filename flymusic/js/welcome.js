const panels = document.querySelectorAll('.panel')
const enter = document.querySelector('.enter')
panels.forEach(panel => {
    panel.addEventListener('click', () => {
        removeActiveClasses()
        panel.classList.add('active')
    })
})

enter.addEventListener('click',()=>{
    window.location.href="../main.html"
})
function removeActiveClasses() {
    panels.forEach(panel => {
        panel.classList.remove('active')
    })
}