import { PlusIcon } from "lucide-react";

import Link from "./navigation/Link";

const ModuleIndex = ({
  itemRoute,
  items,
  newRoute,
  testId,
}: {
  newRoute: string;
  items: number[];
  itemRoute: (id: number) => string;
  testId: { tile: string };
}) => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-8 gap-4">
        <Link
          href={newRoute}
          className="flex aspect-square w-32 items-center justify-center rounded-lg shadow-lg"
        >
          <span className="text-2xl">
            <PlusIcon className="h-10 w-10 stroke-teal-500 text-teal-500" />
          </span>
        </Link>
        {items.map((item) => (
          <Link
            key={item}
            href={itemRoute(item)}
            data-testid={testId.tile}
            className="flex aspect-square w-32 items-center justify-center rounded-lg shadow-lg"
          >
            <span className="text-2xl font-semibold">{item}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModuleIndex;
