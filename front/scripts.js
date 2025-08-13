// logic to work with server
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
    try{
        const msg = JSON.parse(event.data);

        if (msg.type === 'init'){
            msg.notes.forEach(note => {addNote(note, 'old')});
        }
        else if (msg.type === 'note_added'){
            addNote(msg.note, 'new');
        }
    }
    catch (err) {
        console.log(`Error ${err}, data ${event.data}`);
    }
};

// frontend logic
const modalNote = document.getElementById('modal-note');
const modalNoteField = document.getElementById('modal-note__field');
const board = document.getElementById('board');

let x;
let y;
let currentColor = getRandomColor();

board.addEventListener('click', (event) => {
    if(window.getComputedStyle(modalNote).display === "none"){
        const rect = board.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;

        modalNote.style.display = 'flex';
        currentColor = getRandomColor();
        modalNote.className = currentColor;
        modalNoteField.focus();
    }
});

function addNote(note, noteState){
    const newNote = document.createElement('div');
    newNote.className = 'note';

    if (noteState === 'new'){
        newNote.classList.add(currentColor);
    }
    else{
        newNote.classList.add(getRandomColor());
    }

    newNote.style.left = note.cordX + "px";
    newNote.style.top = note.cordY + "px";
    newNote.innerText = note.messageText;
    board.appendChild(newNote);
}

function submitMessage(){
    if (!modalNoteField.innerText.trim()) return;
    const message = modalNoteField.innerText.trim();
    ws.send(JSON.stringify({ type: 'new_note', text: message, X: x, Y: y }));
    closeModalNote();
}

function getRandomColor(){
    const colors = ['note-red', 'note-yellow', 'note-blue'];
    const randomIndex = Math.floor(Math.random() * 3);
    return colors[randomIndex];
}

function closeModalNote(){
    modalNote.style.display = 'none';
    modalNoteField.innerText = '';
}

document.addEventListener('keydown', (event) => {
    if (modalNote.style.display === 'flex'){
        if (event.key === 'Enter'){
            event.preventDefault();
            submitMessage();
            return;
        }

        if (event.key === 'Escape'){
            event.preventDefault();
            closeModalNote();
            return;
        }
    }
});

modalNoteField.addEventListener('keydown', (event) => {
    let text = modalNoteField.innerText;
    if (text.length > 100 && event.key !== 'Backspace' && event.key !== 'Delete'){
        event.preventDefault();
    }
});