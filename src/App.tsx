import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import LinkDetail from "./pages/LinkDetail";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/link/:id" element={<LinkDetail />} />
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
