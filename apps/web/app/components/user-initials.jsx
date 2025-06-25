import React from "react";

/**
 * UserInitials component that displays user initials in a circular background
 * @param {Object} props
 * @param {string} props.userName - Full name of the user (e.g., "John Doe")
 * @param {string} props.size - Size class for the component (e.g., "w-8 h-8" or "w-16 h-16")
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.bgColor - Background color class (default: "bg-[#167AFE]")
 * @param {string} props.textColor - Text color class (default: "text-white")
 */
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
      <span className="text-[1.25rem]/[1.5rem] font-bold font-jakarta">
        {initials}
      </span>
    </div>
  );
}
