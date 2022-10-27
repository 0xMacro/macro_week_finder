//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title WeekFinder
/// @notice A simple contract which takes in a Unix-timestamp, and returns which Week of the Macro Fellowship it exists in
/// @dev See the GitHub repository here: https://github.com/0xMacro/macro_week_finder
/// @dev This will only work for dates **after** October 17th, which shouldn't be a problem because we only ever need to know
/// the Fellowship Week when we're talking about the future
/// @dev A `converterUrl` value exists so that users can easily convert ISO and other non-Unix-timestamp dates into Unix timestamps
contract WeekFinder is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    /// @notice a link to an online tool for converting string dates like
    /// "2022-10-17T00:00:00.000Z"
    /// or
    /// "Thu Oct 27 2022 15:10:50 GMT-0400 (Eastern Daylight Time)"
    /// into Unix timestamps
    string public converterUrl;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        // we always want to disable calling the initializer on the implementation
        // contract. For more info see
        // https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializing_the_implementation_contract
        _disableInitializers();
    }

    /// @notice Setup the WeekFinder, and set initial storage variable values
    /// @param _converterUrl a website that can convert string dates into Unix timestamps
    /// something like https://time.is/Unix_time_converter
    /// @param _newOwner the address that will be able to upgrade the WeekFinder
    /// this will very likely be some address owned by Melville
    function initialize(string memory _converterUrl, address _newOwner) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();

        transferOwnership(_newOwner);

        converterUrl = _converterUrl;
    }

    /// @notice Callback for the OpenZeppelin upgrades contracts, ensures that only the owner
    /// can upgrade this contract
    /// @param newImplementation the address of the new logic contract
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    /// @notice Takes in a Unix-timestamp, and returns which Week of the Macro Fellowship it exists in
    /// @param unixTimestamp the number of seconds past Jan 1 1970 for a particular date
    /// @return weekNumber a string of the from "W0", "W1"... "W6"
    function fromDateToWeekNumber(uint256 unixTimestamp)
        public
        pure
        returns (string memory weekNumber)
    {
        // this is the start of W0 for Block 9. Given an arbitrary date, we can
        // calculate how many weeks it is from this date (modulo 7 weeks) to get
        // the Week number for that arbitrary date
        uint256 WEEK_0_DATE = 1_665_964_800;

        if (unixTimestamp < WEEK_0_DATE) {
            revert TooEarly();
        }

        uint256 remainder = unixTimestamp - WEEK_0_DATE;

        // the number of seconds from the start of W0 to the end of W6
        // a.k.a. 7 weeks
        uint256 NUM_SECONDS_IN_FELLOWSHIP = 4233600;

        if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 1 * 604800) {
            return "W0";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 2 * 604800) {
            return "W1";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 3 * 604800) {
            return "W2";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 4 * 604800) {
            return "W3";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 5 * 604800) {
            return "W4";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP <= 6 * 604800) {
            return "W5";
        } else if (remainder % NUM_SECONDS_IN_FELLOWSHIP < 7 * 604800) {
            return "W6";
        } else {
            revert InvalidTimestamp(unixTimestamp);
        }
    }

    error TooEarly();
    error InvalidTimestamp(uint256 unixTimestamp);
}
