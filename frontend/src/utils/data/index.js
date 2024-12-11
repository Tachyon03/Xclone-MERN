import { formatDistanceToNow } from "date-fns";

export const formatPostDate = (createdAt) =>{
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate)/1000);
    const timeDifferenceInMinutes = Math.floor((timeDifferenceInSeconds)/60);
    const timeDifferenceInHours = Math.floor((timeDifferenceInMinutes)/60);
    const timeDifferenceInDays = Math.floor((timeDifferenceInHours)/24);

    if(timeDifferenceInDays > 1){
        return createdAtDate.toLocaleDateString("en-US", {month : "short", 
            day: "numeric", 
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
    else if(timeDifferenceInDays === 1){
        return "1d";
    }
    else if(timeDifferenceInHours >=1){
        return `${timeDifferenceInHours}h`;
    }
    else if(timeDifferenceInMinutes >=1){
        return `${timeDifferenceInMinutes}m`;
    }
    else{
        return "Just now";
    }
};

export const formatMemberSinceDate = (createdAt) => {
  if (!createdAt) return "Join date not available";
  
  try {
    const date = new Date(createdAt);
    return `Member since ${formatDistanceToNow(date, { addSuffix: true })}`;
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid join date";
  }
};