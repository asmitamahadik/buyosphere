import { useEffect } from "react";

interface PageTitleProps {
    title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
    useEffect(() => {
        document.title = `${title} | Buyosphere`;
        return () => { document.title = "Buyosphere"; };
    }, [title]);
    return null;
};

export default PageTitle;
