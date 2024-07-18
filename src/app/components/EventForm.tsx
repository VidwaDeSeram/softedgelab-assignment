"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ring2 } from "ldrs";

interface EventFormProps {
  event?: Event | null;
  onEventAdded: (event: Event) => void;
  onClose: () => void;
}

interface Event {
  id?: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export default function EventForm({
  event,
  onEventAdded,
  onClose,
}: EventFormProps) {
  const [name, setName] = useState(event?.name || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || "");
  const [location, setLocation] = useState(event?.location || "");

  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  useEffect(() => {
    ring2.register();
    if (event) {
      setName(event.name);
      setDescription(event.description);
      setDate(event.date);
      setLocation(event.location);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = { id: event?.id, name, description, date, location };
    setIsLoading(true);
    try {
      if (event && event.id) {
        const response = await axios.put(
          `http://localhost:8080/api/events/${event.id}`,
          newEvent
        );
        onEventAdded(response.data);
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/events",
          newEvent
        );
        onEventAdded(response.data);
      }
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("There was an error saving the event!", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center">
          <l-ring-2
            size="40"
            stroke="5"
            stroke-length="0.25"
            bg-opacity="0.1"
            speed="0.8"
            color="black"
          ></l-ring-2>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </form>
  );
}
