import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "대시보드", icon: "📊" },
  { to: "/list", label: "공고 목록", icon: "📋" },
];

export default function Sidebar() {
  return (
    <aside className="w-full sm:w-52 shrink-0 bg-white border-b sm:border-b-0 sm:border-r border-gray-200 flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <h1 className="text-sm font-bold text-gray-800">FE 공고 대시보드</h1>
        <p className="text-xs text-gray-400 mt-0.5">Frontend Jobs Tracker</p>
      </div>
      <nav className="flex-1 p-3 flex flex-row sm:flex-col space-x-1 sm:space-x-0 sm:space-y-1 overflow-x-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
