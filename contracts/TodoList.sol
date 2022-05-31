// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

contract TodoList {
    event TaskCreated(uint id, string content, bool status);
    event TaskToggled(uint id, bool completed);
    event ChangesSaved();
    event WriteAccessModified(address addr);

    uint index;
    uint taskCount = 0;
    string title;
    address owner;

    struct Task {
        string content;
        bool status;
    }

    mapping(address => bool) writeAccess;
    mapping(uint => Task) tasks;

    constructor(string memory _title, address _owner, uint _index) {
        index = _index;
        owner = _owner;
        title = _title;
        writeAccess[owner] = true;
    }

    // State Modifiying (Write) Operations
    function saveChanges(uint[] memory _ids, string[] memory _contents, bool[] memory _statuses) public hasWriteAccess {
        for (uint i = 0; i < _ids.length; i++) {
            if (_ids[i] >= taskCount) { taskCount = _ids[i] + 1; }
            tasks[_ids[i]] = Task(_contents[i], _statuses[i]);
            emit TaskCreated(_ids[i], tasks[_ids[i]].content, tasks[_ids[i]].status);
        }

        emit ChangesSaved();
    }

    function toggleCompleted(uint id) public hasWriteAccess {
        tasks[id].status = !tasks[id].status;
        emit TaskToggled(id, tasks[id].status);
    }

    function grantWriteAccess(address addr) public isOwner { 
        writeAccess[addr] = true; 
        emit WriteAccessModified(addr);
    }

    function toggleWriteAccess(address addr) public isOwner { 
        writeAccess[addr] = !writeAccess[addr];
        emit WriteAccessModified(addr);
    }
    
    function transferOwnership(address transferAddr) public isOwner { owner = transferAddr; }

    // Non State-Modifying (Read) Operations
    function getData() public view returns(string[] memory, bool[] memory) { 
        string[] memory _contents = new string[](taskCount);
        bool[] memory _statuses = new bool[](taskCount);

        for (uint i = 0; i < taskCount; i++) {
            _contents[i] = tasks[i].content;
            _statuses[i] = tasks[i].status;
        }

        return(_contents, _statuses); 
    }

    function getIndex() public view returns(uint) { return index; }
    function getTaskCount() public view returns(uint) { return taskCount; }
    function getTitle() public view returns(string memory) { return title; }
    function getWriteStatus() public view returns(bool) { return writeAccess[msg.sender]; }
    function getOwnershipStatus() public view returns(bool) { return (owner == msg.sender); }

    modifier isOwner() {
        require(msg.sender == owner, "This operation is restricted to the owner of the contract");
        _;
    }

    modifier hasWriteAccess() {
        require(writeAccess[msg.sender] == true, "You must have write access to change the contract state");
        _;
    }
}