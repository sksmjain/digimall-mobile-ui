import StoreFront from "./StoreFront";

export default function ProductList() {
    return (
        <>
        <StoreFront items={[]} onSeeAll={() => console.log("see all")} />
        </>
    )
}