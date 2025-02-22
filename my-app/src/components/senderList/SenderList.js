import React, { useState, useEffect } from "react";
import Modal from "../../UI/Dialog";
import { useDispatch } from "react-redux";
import DeleteDialog from "../../UI/deleteDialog";
import { Sidebar } from "../dashboard/components/SideBar";
import { useLocation } from "react-router-dom";
import {
  fetchSenders,
  addSender,
  editSenders,
  deleteSenders,
} from "../../utils/Slices/senderSlice";

function SenderList(props) {
  const [contacts, setContacts] = useState("");
  const location = useLocation();

  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);
  const [editModalState, setEditModalState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [idx, setIdx] = useState(-1);
  const add = props.add;
  const [id, setId] = useState("");
  useEffect(() => {
    dispatch(fetchSenders(add)).then((actionResult) => {
      if (fetchSenders.fulfilled.match(actionResult)) {
        const data = actionResult.payload.data;
        setContacts(data);
      } else if (fetchSenders.rejected.match(actionResult)) {
        
      }
    });
  }, [location]);

  const delButtonHandler = (idx) => {
    setDeleteState(true);
    setId(idx);
  };

  const addHandler = async (data) => {
    data.add = add;
    if (editModalState) {
      dispatch(editSenders({ id, data })).then((actionResult) => {
        if (editSenders.fulfilled.match(actionResult)) {
          const data = actionResult.payload.data;
          const updatedContacts = contacts.map((contact) => {
            if (contact._id === id) {
              return { ...contact, ...data };
            }
            return contact;
          });
          setContacts(updatedContacts);
        }
        setEditModalState(false);

      });
    } else {
      data.add = add;
      const res = await dispatch(addSender(data));
      setContacts([...contacts, data]);
    }
  };
  const editHandler = (id, index) => {
    
   
    setModalState(true);
    setId(id);
    setIdx(index);
    setEditModalState(true);
  };

  const deleteHandler = () => {
    dispatch(deleteSenders(id)).then((actionResult) => {
      if (deleteSenders.fulfilled.match(actionResult)) {
        const data = actionResult.payload;
        const updatedContacts = contacts.filter(
          (contact) => contact._id !== id
        );
        setContacts(updatedContacts);
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-5  h-screen bg-slate-50">
        <div className="lg:col-span-1 lg:inline hidden h-full ">
          <Sidebar />
        </div>
        <div className="lg:col-span-4 col-span-5 inline  h-full md:mt-0 mt-16  ">
          <Modal
            state={modalState}
            onAdd={addHandler}
            val={contacts[idx]}
            onclose={() => {
              setModalState(false);
            }}
          />
          <DeleteDialog
            state={deleteState}
            onClose={() => setDeleteState(false)}
            onConfirm={deleteHandler}
          />
          <div className="h-full bg-slate-50 lg:px-0">
            <h1 className="lg:text-3xl text-xl font-bold tracking-tight text-gray-900 sm:text-4xl pt-5 text-center">
              {add === "sender" ? "Sender List" : "Receiver List"}
            </h1>

            <ul className="xl:mx-28 md:mx-12 md:py-16  py-2 divide-gray-200 ">
              <button
                className="bg-green-500 lg:text-base text-md lg:px-4 px-3 lg:py-2 py-1 text-white font-semibold rounded-sm cursor-pointer"
                onClick={() => {
                  setIdx(-1);
                  setEditModalState(false)
                  setModalState(true);
                }}
              >
                <p className="lg:text-base text-md">Add +</p>
              </button>
              {contacts &&
                contacts.map((contact, index) => (
                  <li key={contact._id} className="py-3 sm:py-4">
                    <div className="flex justify-start sm:px-10 px-2 rounded-md py-5 shadow-md bg-white">
                      <div className="md:flex-1 flex-1">
                        <p className="md:text-sm text-wrap text-xs font-medium text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <p className="md:text-sm text-wrap text-xs text-gray-500 truncate dark:text-gray-400">
                          {contact.email}
                        </p>
                      </div>
                      <div className="md:flex-1 flex-1">
                        <p className="md:text-sm text-wrap text-xs font-medium text-gray-900 truncate">
                          Contact
                        </p>
                        <p className="md:text-sm text-wrap text-xs text-gray-500 truncate dark:text-gray-400">
                          {contact.contact}
                        </p>
                      </div>
                      <div className="md:flex-1 flex-1 ">
                        <p className="md:text-sm text-xs font-medium text-gray-900 truncate">
                          Address
                        </p>
                        <p className="md:text-sm text-wrap md:max-w-full max-w-16 text-xs text-gray-500 truncate  dark:text-gray-400">
                          {contact.address}
                        </p>
                      </div>
                      <div className=" md:flex-row flex flex-col md:justify-between md:ml-1 ml-0 md:my-3 my-0 ">
                        <button
                          onClick={() => delButtonHandler(contact._id)}
                          className="md:px-2 px-1 md:w-16 w-12 md:mb-0 mb-3 md:mr-4 mr-0   bg-red-500 md:h-7 h-5 text-white  rounded-sm font-medium md:text-sm text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => editHandler(contact._id, index)}
                          className=" bg-gray-500 md:w-16 w-12 px-2 md:h-7 h-5 text-white rounded-sm font-medium md:text-sm text-xs"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SenderList;
