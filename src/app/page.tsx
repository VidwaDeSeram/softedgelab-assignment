"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./components/EventForm";
import Modal from "./components/Modal";
import Swal from "sweetalert2";
import { ring2 } from "ldrs";

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  useEffect(() => {
    ring2.register();
    axios
      .get("http://localhost:8080/api/events")
      .then((response) => {
        setEvents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsOperationLoading(true);
        axios
          .delete(`http://localhost:8080/api/events/${id}`)
          .then(() => {
            setEvents(events.filter((event) => event.id !== id));
            setIsOperationLoading(false);
            Swal.fire("Deleted!", "Your event has been deleted.", "success");
          })
          .catch((error) => {
            console.error("There was an error deleting the event!", error);
            setIsOperationLoading(false);
          });
      }
    });
  };

  const handleEventAdded = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const openUpdateModal = (event: Event) => {
    setSelectedEvent(event);
    setUpdateModalOpen(true);
  };

  if (isLoading || isOperationLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <l-ring-2
          size="40"
          stroke="5"
          stroke-length="0.25"
          bg-opacity="0.1"
          speed="0.8"
          color="black"
        ></l-ring-2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="max-w-4xl w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Event
        </button>
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded shadow bg-gray-700"
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(event)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <EventForm
          onEventAdded={handleEventAdded}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <EventForm
          event={selectedEvent}
          onEventAdded={handleEventUpdated}
          onClose={() => setUpdateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
