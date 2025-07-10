# Network Utilities Suite

A user-friendly desktop application built with Electron that provides a graphical interface for common network diagnostic tools like Ping, Traceroute, DNS Lookup, and more.

![Application Screenshot](<placeholder-for-your-screenshot.png>)

This project is a practical example of building a full-stack desktop application using web technologies, demonstrating secure command execution via Electron's IPC (Inter-Process Communication) and dynamic UI updates.

## Features

-   **Ping:** Send ICMP echo requests to any host to check its reachability and latency.
-   **Traceroute:** Trace the network path to a destination and see all the hops along the way.
-   **DNS Lookup:** Perform DNS queries to find IP addresses, MX records, and other domain information.
-   **Port Scanner:** Scan for open TCP ports on a target IP address.
-   **And more!** The tabbed interface is ready for new utilities.

## Technologies Used

-   **Electron:** Framework for building desktop applications with web technologies.
-   **Node.js:** Powers the main Electron process and executes system commands via `child_process`.
-   **HTML5, CSS3, JavaScript:** For the user interface and frontend logic.
-   **Bootstrap 5:** For responsive and modern UI styling.

## Project Structure

```
network-utilities-suite/
├── main.js         # Electron main process (backend logic)
├── preload.js      # Secure bridge between frontend and backend
├── index.html      # Application UI
├── renderer.js     # Frontend logic
├── package.json    # Dependencies and project metadata
└── README.md       # You are here!
```


## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/network-utilities-suite.git
    cd network-utilities-suite
    ```
    *Replace `YOUR_USERNAME` with your GitHub username.*

2.  **Install Node.js:** If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/). `npm` (Node Package Manager) comes with Node.js.

3.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will install Electron and other necessary packages defined in `package.json`.

4.  **Run the Application:**
    ```bash
    npm start
    ```
    This will launch the Electron desktop application window.

## How It Works

-   **`main.js`**: This is the Node.js process that controls the lifecycle of your Electron application. It creates browser windows and handles system-level events. Crucially, it hosts the `ipcMain` handlers that receive requests from the frontend and execute Node.js-specific tasks, such as running `child_process` commands (like `ping`, `tracert`) or performing raw socket operations (`net` module for port scanning).
-   **`preload.js`**: This script acts as a sandbox. It runs in the renderer process *before* `index.html` loads, and uses `contextBridge` to securely expose a limited API (`window.api`) to your `renderer.js`. This prevents your frontend from directly accessing Node.js APIs, enhancing security.
-   **`index.html`**: This is the visual interface of your app. It uses standard HTML, CSS (Bootstrap for styling), and JavaScript. It's built with a tabbed layout to navigate between the different network utilities.
-   **`renderer.js`**: This script runs in the browser-like environment of the `index.html`. It handles user interactions (button clicks, input changes) and uses the `window.api` bridge to send requests to the `main.js` process. The results received from `main.js` are then dynamically displayed in the UI.

## Future Enhancements (Ideas for you!)

-   **Improved Output Parsing:** More robust parsing of CLI output (e.g., table format for `ping` results, structured `tracert` hops).
-   **Historical Data:** Store results of previous scans/lookups in a local database (e.g., SQLite via `sqlite3` Node.js package).
-   **Configuration/Settings:** Allow users to save preferred hosts, default port ranges.
-   **Export Results:** Option to export results to a text file or CSV.
-   **Visualizations:** Integrate charting libraries (e.g., Chart.js) for graphical representations of ping latency or port scan results.
-   **Network Connectivity Check:** Add a simple status indicator for internet connectivity.
-   **Error Handling:** Implement more descriptive and user-friendly error messages.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
