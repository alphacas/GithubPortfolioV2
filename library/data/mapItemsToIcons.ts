import {
  AcademicCapIcon,
  CalendarIcon,
  FlagIcon,
  MapIcon,
  OfficeBuildingIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import GithubIcon from "../../components/Icon/GithubIcon";
import StackOverflowIcon from "../../components/Icon/StackOverflowIcon";
import LinkedInIcon from "../../components/Icon/LinkedInIcon";
import InstagramIcon from "../../components/Icon/InstagramIcon";
import TwitterIcon from "../../components/Icon/TwitterIcon";
import Icon from "../../components/Icon/Icon";

export function mapLabelToIcon(label: string) {
  switch (label) {
    case "Age":
      return CalendarIcon;
    case "Employment":
      return OfficeBuildingIcon;
    case "Interests":
      return SparklesIcon;
    case "Location":
      return MapIcon;
    case "Nationality":
      return FlagIcon;
    case "Study":
      return AcademicCapIcon;
    default:
      return;
  }
}

export function mapSocialToIcon(label: string) {
  switch (label) {
    case "Github":
      return GithubIcon;
    case "Stack Overflow":
      return StackOverflowIcon;
    case "LinkedIn":
      return LinkedInIcon;
    case "Instagram":
      return InstagramIcon;
    case "Twitter":
      return TwitterIcon;
    default:
      return Icon;
  }
}
