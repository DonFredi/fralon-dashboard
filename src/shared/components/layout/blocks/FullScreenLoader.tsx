import FullPageLoader from "@/shared/icons/full-page-loader";
import { H4 } from "../typography/Typography";
import SectionWrapper from "./SectionWrapper";

export default function FullScreenLoader() {
  return (
    <SectionWrapper className="flex items-center justify-center flex-col flex-1 h-full">
      <FullPageLoader />
      <H4 className="">Loading...</H4>
    </SectionWrapper>
  );
}
