import { NavLink } from "react-router-dom";


const branchPickerConfig = [
    {
        label: 'All',
        id: 1,
    },
    {
        label: 'Today',
        id: 2,
    },
    {
        label: '12 Hour',
        id: 3,
    },
    {
        label: '3 Hour',
        id: 4,
    },
    {
        label: '1 Hour',
        id: 5,
    },
];

export const BranchPicker = () => {
    return (
        <div className="branch-picker">
            { branchPickerConfig.map(branch => (
                <NavLink
                    key={branch.id}
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                    to={`/pre/${branch.id}`}
                >
                    {branch.label}
                </NavLink>
            ))}
        </div>
    );
};