export function modalWindow(element, inputData) {
    const data = {
        title: 'Modal title',
        ...inputData
    }

    const html = `
        <a href="#!" class="modal-overlay"></a>
        <div class="modal-dialog modal-dialog-lg">
            <h3>${data.title}</h3>
            <div class="modal-content"></div>
        </div>
    `;
    element.innerHTML = html;
    if (data.content) {
        element.querySelector('.modal-content').appendChild(data.content);
    }


    // element.querySelector('.modal-overlay').addEventListener('click', () => {
    //     element.classList.remove('open');
    //     element.innerHTML = '';
    // });

    return {
        element,
        open() {
            element.classList.add('open');
        },
        close() {
            element.classList.remove('open');
            element.innerHTML = '';
        },
        isOpen() {
            return element.classList.contains('open');
        }
    }
};