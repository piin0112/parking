import Icons from "../assets/images/icons";
import { useSelector, useDispatch } from "react-redux";
import { filterActions } from "../store/store";

function Filter() {
    const dispatch = useDispatch();
    const showFilter = useSelector((state) => state.filter.showFilter);
    const district = useSelector((state) => state.filter.district);

    const District = [
        "中西區",
        "東區",
        "南區",
        "北區",
        "安平區",
        "安南區",
        "永康區",
        "歸仁區",
        "新化區",
        "左鎮區",
        "玉井區",
        "楠西區",
        "南化區",
        "仁德區",
        "關廟區",
        "龍崎區",
        "官田區",
        "麻豆區",
        "佳里區",
        "西港區",
        "七股區",
        "將軍區",
        "學甲區",
        "北門區",
        "新營區",
        "後壁區",
        "白河區",
        "東山區",
        "六甲區",
        "下營區",
        "柳營區",
        "鹽水區",
        "善化區",
        "大內區",
        "山上區",
        "新市區",
        "安定區",
    ];

    const RenderDistrictButton = District.map((District) => {
        return (
            <li key={District} className="filter__button-items">
                <button
                    className="filter__button-item"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(filterActions.getDistrict(District));
                    }}
                >
                    <Icons.SVGParking />
                    {District}
                </button>
            </li>
        );
    });

    return (
        <div className="filter">
            <button className="filter__header-container">
                <Icons.SVGLastStepInFilter
                    className="filter__header-SVGLastStep"
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(filterActions.notShowFilter());
                    }}
                />
            </button>
            <form className="filter__container">
                <h2>從區域找：{district ? `「${district}」` : ""}</h2>
                <ul className="filter__button-container">{RenderDistrictButton}</ul>
            </form>
            <div className="filter__button-cancel-container">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(filterActions.removeDistrict());
                    }}
                    className="filter__button-cancel"
                >
                    取消選取
                </button>
            </div>
        </div>
    );
}

export default Filter;
