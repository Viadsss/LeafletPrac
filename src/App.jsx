import CreateMap from "./pages/CreateMap";

const center = [14.676208, 121.043861];

function App() {
  return (
    <>
      <CreateMap center={center} limit={10} />
    </>
  );
}

export default App;
