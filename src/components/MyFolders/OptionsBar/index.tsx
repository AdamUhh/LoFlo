import Layout from "./Layout";
import Search from "./Search";
import Sort from "./Sort";

export default function OptionsBar() {
  return (
    <div className="flex justify-between">
      <div className="w-[40%]">
        <Search />
      </div>
      <div className="flex gap-2">
        <Sort />
        {/* <Layout /> */}
      </div>
    </div>
  );
}
