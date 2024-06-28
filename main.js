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

    // 防止重复点击的标志变量
    let isCopying = false;
    let isRandomPlaying = false;

    // 添加点击复制功能，只绑定一次事件
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        row.addEventListener('click', (event) => {
            if (isCopying) return;
            isCopying = true;
            event.stopImmediatePropagation();
            copySongInfo(event);
            setTimeout(() => {
                isCopying = false;
            }, 1000);
        });
    });

    function copySongInfo(event) {
        const cells = event.currentTarget.querySelectorAll('td');
        const title = cells[1].textContent.trim();
        const artist = cells[2].textContent.trim();
        const textToCopy = `点歌《${title}》- ${artist}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert(`已复制: ${textToCopy}`);
        }).catch(err => {
            console.error('复制失败: ', err);
        });
    }

    const profileCard = document.querySelector('.profile-card');
    profileCard.addEventListener('click', () => {
        window.open('https://live.bilibili.com/1967341768?broadcast_type=0&is_room_feed=0&spm_id_from=333.999.to_liveroom.0.click&live_from=86002', '_blank'); 
    });

    const randomPlayButton = document.querySelector('.random-play');
    randomPlayButton.addEventListener('click', (event) => {
        if (isRandomPlaying) return;
        isRandomPlaying = true;
        event.stopImmediatePropagation();
        const rows = document.querySelectorAll('#playlist tbody tr');
        const randomIndex = Math.floor(Math.random() * rows.length);
        const selectedRow = rows[randomIndex];
        const cells = selectedRow.querySelectorAll('td');
        const title = cells[1].textContent.trim();
        const artist = cells[2].textContent.trim();
        const textToCopy = `点歌《${title}》- ${artist}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert(`已复制: ${textToCopy}`);

            rows.forEach(row => row.classList.remove('highlight', 'enlarge'));
            selectedRow.classList.add('highlight', 'enlarge');
            selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                selectedRow.classList.remove('highlight', 'enlarge');
                isRandomPlaying = false;
            }, 5000);
        }).catch(err => {
            console.error('复制失败: ', err);
            isRandomPlaying = false;
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background color: yellow! important;
        }
        .enlarge {
            animation: enlargeAnimation 5s forwards;
        }
        @keyframes enlargeAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.append(style);

    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
