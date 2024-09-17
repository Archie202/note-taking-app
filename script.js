// Initialize Quill editors for both note creation and editing
var quill = new Quill('#editor', {
    theme: 'snow'
  });
  
  var editQuill = new Quill('#editEditor', {
    theme: 'snow'
  });
  
  var editNoteIndex;  // Store the index of the note being edited
  
  // Load existing notes from LocalStorage when the page loads
  window.onload = function() {
    showNotes();
  };
  
  // Function to add a note
  function addNote() {
    let noteContent = quill.root.innerHTML;  // Get rich text content
    let tagsInput = document.getElementById("noteTags").value;
  
    if (noteContent.trim() === "<p><br></p>") {
      alert("Please write something before adding a note!");
      return;
    }
  
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    let newNote = {
      content: noteContent,
      tags: tagsInput.split(",").map(tag => tag.trim())
    };
  
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
  
    // Clear inputs after adding the note
    quill.root.innerHTML = "";
    document.getElementById("noteTags").value = "";
  
    showNotes();
  }
  
  // Function to show all notes
  function showNotes() {
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    let notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";  // Clear the container
  
    notes.forEach((note, index) => {
      let noteDiv = document.createElement("div");
      noteDiv.classList.add("note");
      noteDiv.innerHTML = `
        ${note.content}
        <small>Tags: ${note.tags.join(", ")}</small>
        <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
        <button onclick="deleteNote(${index})">X</button>
      `;
      notesContainer.appendChild(noteDiv);
    });
  }
  
  // Function to delete a note
  function deleteNote(index) {
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    notes.splice(index, 1);  // Remove the note by index
    localStorage.setItem("notes", JSON.stringify(notes));
  
    showNotes();
  }
  
  // Function to open the modal and populate it with the selected note's content
  function openEditModal(index) {
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    editQuill.root.innerHTML = notes[index].content;  // Set editor content
    document.getElementById("editTags").value = notes[index].tags.join(", ");  // Set tags
  
    editNoteIndex = index;  // Store the index of the note being edited
  
    // Show the modal
    document.getElementById("editModal").style.display = "block";
  }
  
  // Function to close the modal
  function closeModal() {
    document.getElementById("editModal").style.display = "none";
  }
  
  // Function to save the edited note
  function saveEditedNote() {
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    let editedContent = editQuill.root.innerHTML;  // Get edited content
    let editedTags = document.getElementById("editTags").value.split(",").map(tag => tag.trim());
  
    if (editedContent.trim() === "<p><br></p>") {
      alert("Please write something before saving changes!");
      return;
    }
  
    // Update the note with new content and tags
    notes[editNoteIndex].content = editedContent;
    notes[editNoteIndex].tags = editedTags;
  
    localStorage.setItem("notes", JSON.stringify(notes));
  
    // Close the modal and refresh the notes display
    closeModal();
    showNotes();
  }
  
  // Function to search notes
  function searchNotes() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
  
    let notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";  // Clear the container
  
    notes.forEach((note, index) => {
      if (
        note.content.toLowerCase().includes(query) || 
        note.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        let noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.innerHTML = `
          ${note.content}
          <small>Tags: ${note.tags.join(", ")}</small>
          <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
          <button onclick="deleteNote(${index})">X</button>
        `;
        notesContainer.appendChild(noteDiv);
      }
    });
  }
  