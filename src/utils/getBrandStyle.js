import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGithub, FaGoogle, FaGlobe, FaYoutube } from "react-icons/fa";

export const getBrandStyle = (platformName) => {
  const name = platformName.toLowerCase();

  if (name.includes("instagram")) return { icon: <FaInstagram />, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" };
  if (name.includes("facebook")) return { icon: <FaFacebook />, color: "text-blue-600", bg: "bg-blue-600/10", border: "border-blue-600/20" };
  if (name.includes("linkedin")) return { icon: <FaLinkedin />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (name.includes("twitter") || name.includes("x")) return { icon: <FaTwitter />, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" };
  if (name.includes("github")) return { icon: <FaGithub />, color: "text-gray-200", bg: "bg-gray-700/50", border: "border-gray-500/20" };
  if (name.includes("youtube")) return { icon: <FaYoutube />, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
  if (name.includes("google") || name.includes("gmail")) return { icon: <FaGoogle />, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };

  return { icon: <FaGlobe />, color: "text-gray-400", bg: "bg-gray-800", border: "border-gray-700" };
};