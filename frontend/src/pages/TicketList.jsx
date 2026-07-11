import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load tickets");
    }
  };

  const closeTicket = async (id) => {
    try {
      await api.put(`/tickets/${id}/close`);

      loadTickets();
    } catch (err) {
      console.log(err);
      alert("Unable to close ticket");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            All Tickets
          </h1>

          <Link
            to="/create-ticket"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Create Ticket
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4">ID</th>
                <th>Summary</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {tickets.map((ticket) => (

                <tr
                  key={ticket.id}
                  className="border-t text-center"
                >

                  <td className="p-4">
                    {ticket.id}
                  </td>

                  <td>
                    {ticket.summary}
                  </td>

                  <td>
                    {ticket.priority}
                  </td>

                  <td>
                    {ticket.category}
                  </td>

                  <td>
                    {ticket.department}
                  </td>

                  <td>

                    <span
                      className={
                        ticket.status === "Closed"
                          ? "text-green-600 font-bold"
                          : "text-orange-600 font-bold"
                      }
                    >
                      {ticket.status}
                    </span>

                  </td>

                  <td>

                    {ticket.status === "Open" && (

                      <button
                        onClick={() => closeTicket(ticket.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Close
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}