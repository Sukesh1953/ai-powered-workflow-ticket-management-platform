import { useEffect, useState } from "react";
import api from "../services/api";
import TicketChart from "../components/TicketChart";

function Dashboard() {

    const [stats, setStats] = useState({
        total_tickets: 0,
        open_tickets: 0,
        closed_tickets: 0
    });
    const [selectedTicket, setSelectedTicket] =
    useState(null);

    const [tickets, setTickets] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const loadData = async () => {

        try {

            const statsResponse =
                await api.get("/tickets/stats");

            setStats(statsResponse.data);

            const ticketsResponse =
                await api.get("/tickets");

            setTickets(ticketsResponse.data);

        } catch (error) {

            console.error(error);

        }
    };

    const closeTicket = async (ticketId) => {

        try {

            await api.put(
                `/tickets/${ticketId}/close`
            );

            await loadData();

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {

        loadData();

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
        

            <div className="mb-8">

    <h1 className="text-4xl font-bold">
        AI Workflow & Ticket Platform
    </h1>

    <p className="text-gray-500 mt-2">
        Intelligent ticket management powered by AI
    </p>

</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

    <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-500">
            Total Tickets
        </h3>

        <h1 className="text-4xl font-bold">
            {stats.total_tickets}
        </h1>
    </div>

    <div className="bg-green-50 rounded-xl shadow-md p-6">
        <h3 className="text-green-700">
            Open Tickets
        </h3>

        <h1 className="text-4xl font-bold">
            {stats.open_tickets}
        </h1>
    </div>

    <div className="bg-red-50 rounded-xl shadow-md p-6">
        <h3 className="text-red-700">
            Closed Tickets
        </h3>

        <h1 className="text-4xl font-bold">
            {stats.closed_tickets}
        </h1>
    </div>

    <div className="bg-yellow-50 rounded-xl shadow-md p-6">
        <h3 className="text-yellow-700">
            Critical Tickets
        </h3>

        <h1 className="text-4xl font-bold">
            {
                tickets.filter(
                    t => t.priority === "Critical"
                ).length
            }
        </h1>
    </div>

</div>
            <h2>Tickets</h2>
            <TicketChart tickets={tickets} />

            <input
    type="text"
    placeholder="🔍 Search tickets..."
    value={search}
    onChange={(e) =>
        setSearch(e.target.value)
    }
    className="
        border
        rounded-xl
        p-3
        w-80
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        mb-5
        mr-4
    "
/>

            <select
                value={statusFilter}
                onChange={(e) =>
                    setStatusFilter(e.target.value)
                }
                style={{
                    padding: "10px",
                    marginRight: "15px"
                }}
            >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>

            <select
                value={priorityFilter}
                onChange={(e) =>
                    setPriorityFilter(e.target.value)
                }
                style={{
                    padding: "10px"
                }}
            >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

            <br />
            <br />
            {selectedTicket && (

    <div
        className="
bg-white
rounded-xl
shadow-md
p-6
mb-6
"
    >

        <h2>
            Ticket #{selectedTicket.id}
        </h2>

        <p>
            <b>Summary:</b>{" "}
            {selectedTicket.summary}
        </p>

        <p>
            <b>Category:</b>{" "}
            {selectedTicket.category}
        </p>

        <p>
            <b>Department:</b>{" "}
            {selectedTicket.department}
        </p>

        <p>
            <b>Assigned To:</b>{" "}
            {selectedTicket.assigned_to}
        </p>

        <p>
            <b>Priority:</b>{" "}
            {selectedTicket.priority}
        </p>

        <p>
            <b>Status:</b>{" "}
            {selectedTicket.status}
        </p>

        <button
            onClick={() =>
                setSelectedTicket(null)
            }
        >
            Close
        </button>

    </div>

)}

            <table
    className="
    w-full
    bg-white
    shadow-md
    rounded-xl
    overflow-hidden
    "
>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Summary</th>
                        <th>Category</th>
                        <th>Department</th>
                        <th>Assigned To</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
<tbody>

    {tickets

        .filter((ticket) => {

            const searchMatch =
                ticket.summary
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const statusMatch =
                statusFilter === "All"
                    ? true
                    : ticket.status === statusFilter;

            const priorityMatch =
                priorityFilter === "All"
                    ? true
                    : ticket.priority === priorityFilter;

            return (
                searchMatch &&
                statusMatch &&
                priorityMatch
            );

        })

        .map((ticket) => (

            <tr
                key={ticket.id}
                className="
                    hover:bg-gray-100
                    even:bg-gray-50
                "
            >

                <td className="border p-3">
                    {ticket.id}
                </td>

                <td className="border p-3 w-[350px]">

    <button
        onClick={() =>
            setSelectedTicket(ticket)
        }
        className="
            text-blue-600
            hover:text-blue-800
            hover:underline
            text-left
            block
            w-full
        "
    >

        <div className="
            overflow-hidden
            text-ellipsis
            whitespace-nowrap
        ">
            {ticket.summary}
        </div>

    </button>

</td>

                <td className="border p-3">
                    {ticket.category}
                </td>

                <td className="border p-3 w-[220px]">
                    <div className="truncate">
                        {ticket.department}
                    </div>
                </td>

                <td className="border p-3 w-[220px]">
                    <div className="truncate">
                        {ticket.assigned_to}
                    </div>
                </td>

                <td className="border p-3 text-center">

                    {ticket.priority === "Critical" && (
                        <span
                            className="
                            bg-red-100
                            text-red-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            Critical
                        </span>
                    )}

                    {ticket.priority === "High" && (
                        <span
                            className="
                            bg-orange-100
                            text-orange-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            High
                        </span>
                    )}

                    {ticket.priority === "Medium" && (
                        <span
                            className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            Medium
                        </span>
                    )}

                    {ticket.priority === "Low" && (
                        <span
                            className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            Low
                        </span>
                    )}

                </td>

                <td className="border p-3 text-center">

                    {ticket.status === "Open" ? (

                        <span
                            className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            Open
                        </span>

                    ) : (

                        <span
                            className="
                            bg-gray-200
                            text-gray-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            "
                        >
                            Closed
                        </span>

                    )}

                </td>

                <td className="border p-3 text-center">

                    {ticket.status === "Open" ? (

                        <button
                            onClick={() =>
                                closeTicket(ticket.id)
                            }
                            className="
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            transition
                            "
                        >
                            Close Ticket
                        </button>

                    ) : (

                        <span className="text-gray-500">
                            Closed
                        </span>

                    )}

                </td>

            </tr>

        ))}

</tbody>

            </table>

        </div>
    );
}

export default Dashboard;