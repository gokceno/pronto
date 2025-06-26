export default function UserInitials({
  userName,
  size = "w-8 h-8",
  className = "",
  bgColor = "bg-[#167AFE]",
  textColor = "text-white",
}) {
  const getInitials = (name) => {
    if (!name) return "U";

    const names = name.trim().split(/\s+/);
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    // Get first letter of first name and first letter of last name
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  };

  const initials = getInitials(userName);

  return (
    <div
      className={`${size} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-jakarta font-semibold ${className}`}
    >
      <span className="text-[0.875rem]/[1rem] font-semibold font-jakarta">
        {initials}
      </span>
    </div>
  );
}
