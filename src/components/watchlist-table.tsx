import { Button, Icon, Shad } from "./ui";

const WatchlistTable = () => {
  const header = [
    "",
    "Company",
    "Symbol",
    "Price",
    "Change",
    "Market Cap",
    "P/E Ratio",
    "Alert",
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">My Watchlist</h2>
        <Button className="bg-yellow-500 rounded-sm">Add Stock</Button>
      </div>
      <Shad.Table className="rounded-lg overflow-hidden">
        <Shad.TableHeader>
          <Shad.TableRow className="bg-gray-700 hover:bg-gray-700 rounded-lg">
            {header.map((title) => (
              <Shad.TableHead key={title}>{title}</Shad.TableHead>
            ))}
          </Shad.TableRow>
        </Shad.TableHeader>
        <Shad.TableBody>
          <Shad.TableRow className="bg-gray-800 hover:bg-gray-800/75">
            <Shad.TableCell>
              <Icon
                name="Star"
                className="fill-current size-5 text-yellow-500"
              />
            </Shad.TableCell>
            <Shad.TableCell>Apple Inc.</Shad.TableCell>
            <Shad.TableCell>AAPL</Shad.TableCell>
            <Shad.TableCell>$150.00</Shad.TableCell>
            <Shad.TableCell className="text-green-500">+1.5%</Shad.TableCell>
            <Shad.TableCell>$2.5T</Shad.TableCell>
            <Shad.TableCell>28.5</Shad.TableCell>
            <Shad.TableCell className="w-[120px]">
              <Button className="bg-yellow-800/75 hover:bg-yellow-800/50 rounded-xs text-orange-400 px-2 text-sm">
                Set Alert
              </Button>
            </Shad.TableCell>
          </Shad.TableRow>
        </Shad.TableBody>
      </Shad.Table>
    </>
  );
};
export default WatchlistTable;
