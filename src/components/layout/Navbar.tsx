export default function Navbar() {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        {/* You can add a logo or title here */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Professional Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="
            border border-gray-300
            rounded-full
            px-4 py-2
            focus:outline-none
            focus:ring-2 focus:ring-[#a7a0d194]
           
            transition
            shadow-sm
            w-64
          "
        />

        {/* User Avatar */}
        <img
          src="/avatars/user.png"
          alt="User"
          className="h-10 w-10 rounded-full border border-gray-200 shadow-sm"
        />
      </div>
    </header>
  );
}
