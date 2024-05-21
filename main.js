document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll('#playlist tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const serialNumber = cells[0].textContent.toLowerCase();
            const title = cells[1].textContent.toLowerCase();
            const artist = cells[2].textContent.toLowerCase();

            const isSerialNumberMatch = serialNumber === filter;
            const isTitleMatch = title.includes(filter);
            const isArtistMatch = artist.includes(filter);

            row.style.display = isSerialNumberMatch || isTitleMatch || isArtistMatch ? '' : 'none';
        });
    });

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    const table = document.querySelector('#playlist');
    const th = table.querySelector('th[data-sort="number"]');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(0, true))
        .forEach(tr => tbody.appendChild(tr));
    th.classList.add('asc', 'active');

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', function() {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        const asc = !th.classList.contains('asc');
        Array.from(table.querySelectorAll('th')).forEach(th => th.classList.remove('asc', 'desc', 'active'));
        th.classList.toggle('asc', asc);
        th.classList.toggle('desc', !asc);
        th.classList.add('active');
        Array.from(tbody.querySelectorAll('tr'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), asc))
            .forEach(tr => tbody.appendChild(tr));
    }));

    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const showSlides = () => {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index === slideIndex ? 0 : 100}%)`;
        });
        slideIndex = (slideIndex + 1) % slides.length;
    };
    showSlides();
    setInterval(showSlides, 3000); // 每3秒切换一次图片
});
