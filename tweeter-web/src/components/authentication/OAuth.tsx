import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../toaster/MessageHooks";

const OAuth = () => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };
  const providers: { name: string; icon: IconName }[] = [
    { name: "Google", icon: "google" },
    { name: "Facebook", icon: "facebook" },
    { name: "Twitter", icon: "twitter" },
    { name: "LinkedIn", icon: "linkedin" },
    { name: "GitHub", icon: "github" },
  ];

  return (
    <div className="text-center mb-3">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              `${provider.name} registration is not implemented.`
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`${provider.name.toLowerCase()}Tooltip`}>{provider.name}</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", provider.icon]} />
          </OverlayTrigger>
        </button>
      ))}
    </div>
  );
};

export default OAuth;