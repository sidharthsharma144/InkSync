import React from "react";
import Navbar from "../../src/components/Navbar";
import SearchBar from "./Notes/components/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import SingleNoteCard from "./Notes/components/NoteCard/SingleNoteCard";
// import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance"; // PATH SHI KRNA HAI ABHI
import Toast from "./Notes/components/ToastMessage/Toast";
import { useNavigate } from "react-router-dom";
import EmptyCard from "./Notes/components/EmptyCard/EmptyCard";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";



function NotesMain() {
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                navigate("/note-app");
            } else {
                navigate("/login");
            }
        });
    }, []);
  const [allNotes, setAllNotes] = useState([]);

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };
// *************************************************************************
  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred...Try Again!!");
    }
  };

  // Delete Notes
  const deleteNote = async (data) => {

    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId)

      if(response.data && !response.data.error){
        showToastMessage("Note Deleted Successfully", 'delete')
        getAllNotes();
      }

    } catch (error) {
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        console.log("An unexpected error occurred... Please try again!!");

      }
    }
  }

  // const navigate = useNavigate();

  useEffect(() => {
      getAllNotes();

    return () => {}
  }, [])


  // Pin Note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
      try {
        const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
            isPinned : !noteData.isPinned
          }
        );

        if(response.data && response.data.note){
          showToastMessage("Note Updated Successfully");
          getAllNotes();
        }

      } catch (error) {
        console.log(error);
        
      }
  }


  // Search Note
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const handleSearch = () => {
    if(searchQuery == ""){
      setIsSearch(false);
      getAllNotes();
    }
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllNotes();
  };


    // API Request
  const onSearchNote = async (query) => {
    
    try {
      const response = await axiosInstance.get("/search-notes", {
        params : {query},
      });

      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
      if (response.data.notes.length === 0) {
        setAllNotes([]);
        setIsSearch(false);
        // return;
      }

      console.log("Search query:", query);
      console.log("Response:", response.data);

    } catch (error) {
      console.error(error);
    }
  }

  // Instant Search with useEffect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsSearch(false);
      getAllNotes(); // Fetch all notes when search is cleared
    } else {
      onSearchNote(searchQuery); // Fetch search results
    }
  }, [searchQuery]); // Run whenever `searchQuery` changes


  return (
    <>
    <Navbar/>
      <div className="mt-24 mb-8 flex items-center justify-center ">
        <div className="h-20 flex items-center justify-center">
          
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            // onSearchNote={onSearchNote}
            // handleClearSearch={handleClearSearch}
          />

        </div>
      </div>

      <div className="">
        {allNotes.length > 0 ? (
          <div
            className="container w-[80%] mx-auto columns-2 lg:columns-4 md:columns-3 sm:columns-2 gap-x-3 lg:gap-x-6 md:gap-x-5 sm:gap-x-4"
            // style={{ minHeight: "calc(100vh - 19vh)" }}
          >
            {allNotes.map((item, index) => (
              <SingleNoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full">
            <EmptyCard />
          </div>
        )}
      </div>

      <div className="plusIcon bg-black w-16 h-16 rounded-xl fixed right-8 bottom-8 sm:right-16 sm:bottom-16 flex justify-center items-center text-5xl shadow-2xl shadow-slate-500 z-50">
        <button
          className="text-white"
          onClick={() => {
            setOpenAddEditModel({ isShown: true, type: "add", data: null });
          }}
        >
          +
        </button>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default NotesMain;
