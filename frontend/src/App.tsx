import "react";
import {
	createHashRouter,
	RouterProvider,
} from "react-router-dom";

import { Home } from "./pages/Home";

const router = createHashRouter([
	{
		path: "/",
		element: <Home />,
		children: []
	},
]);

function App() {
  return (
		<RouterProvider router={router}>
		</RouterProvider>
	);
}

export default App;
