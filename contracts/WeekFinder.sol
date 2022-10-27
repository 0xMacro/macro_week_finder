//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title WeekFinder
/// @notice A simple contract which takes in a Unix-timestamp, and returns which Week of the Macro Fellowship it exists in
/// @dev A `converterUrl` value exists so that users can easily convert ISO and other non-Unix-timestamp dates into Unix timestamps
contract WeekFinder is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    /// @notice a link to an online tool for converting string dates like
    /// "2022-10-17T00:00:00.000Z"
    /// or
    /// "Thu Oct 27 2022 15:10:50 GMT-0400 (Eastern Daylight Time)"
    /// into Unix timestamps
    string public converterUrl;

    /// @notice see WeekFinder.initialize
    uint256 private WEEK_0_DATE;

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
    function initialize(string memory _converterUrl, address _newOwner) public {
        __UUPSUpgradeable_init();
        __Ownable_init();

        transferOwnership(_newOwner);

        converterUrl = _converterUrl;

        // this is the start of W0 for Block 9. Given an arbitrary date, we can
        // calculate how many weeks it is from this date (modulo 7 weeks) to get
        // the Week number for that arbitrary date
        WEEK_0_DATE = 1_665_964_800;
    }


    
}
