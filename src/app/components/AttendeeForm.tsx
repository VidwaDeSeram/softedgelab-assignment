import { useState } from "react";

interface AttendeeFormProps {
  eventId: number | undefined;
  onAttendeeAdded: (eventId: number, attendee: { name: string }) => void;
  onClose: () => void;
}

export default function AttendeeForm({
  eventId,
  onAttendeeAdded,
  onClose,
}: AttendeeFormProps) {
  const [attendeeName, setAttendeeName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId) {
      onAttendeeAdded(eventId, { name: attendeeName });
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add Attendee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="attendee" className="block text-white mb-2">
            Attendee Name
          </label>
          <input
            id="attendee"
            type="text"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
