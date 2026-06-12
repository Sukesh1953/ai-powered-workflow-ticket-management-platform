import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function TicketChart({ tickets }) {

    const critical =
        tickets.filter(
            t => t.priority === "Critical"
        ).length;

    const high =
        tickets.filter(
            t => t.priority === "High"
        ).length;

    const medium =
        tickets.filter(
            t => t.priority === "Medium"
        ).length;

    const low =
        tickets.filter(
            t => t.priority === "Low"
        ).length;

    const data = {
        labels: [
            "Critical",
            "High",
            "Medium",
            "Low"
        ],
        datasets: [
            {
                label: "Tickets",
                data: [
                    critical,
                    high,
                    medium,
                    low
                ]
            }
        ]
    };

    return (
        <div
            style={{
                width: "600px",
                marginBottom: "30px"
            }}
        >
            <Bar data={data} />
        </div>
    );
}

export default TicketChart;