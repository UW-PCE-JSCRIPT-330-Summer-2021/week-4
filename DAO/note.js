const note = require('../models/note');
const User = require('../models/user')
module.exports ={},
module.exports.createNote = async (UserId, NoteId) =>{
    return await Note.create(note);
}
module.exports.getUserNotes= async (UserId)=>{
    const notes = await note.findOne({_id: noteId, UserId:UserId}). learn();
    if(!note){
       send error Message("note not found");
    }
    return note;
}
module.exports = router;
