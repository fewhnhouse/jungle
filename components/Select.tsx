import Select from 'react-select'

const customStyles = {
    option: (provided, { isFocused, isSelected }) => ({
        ...provided,
        color: '#6c757d',
        backgroundColor: isSelected
            ? '#dadfe4'
            : isFocused
            ? '#e9ecef'
            : 'white',
    }),
    control: (provided) => ({
        ...provided,
        height: 42,
        background: '#e9ecef',
        '&:hover': {
            background: '#dadfe4',
        },
        border: 'none',
        width: 160,
        margin: '5px 0px',
    }),
    indicatorSeparator: () => ({
        visibility: 'none',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1
        const transition = 'opacity 300ms'

        return { ...provided, opacity, transition }
    },
}

export default function CustomSelect() {
    return (
        <Select
            isSearchable={false}
            defaultValue={{ value: '1', label: 'To Do' }}
            options={[
                { value: '1', label: 'To Do' },
                { value: '2', label: 'Doing' },
            ]}
            styles={customStyles}
        />
    )
}
