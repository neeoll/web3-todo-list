// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;
import './TodoList.sol';

contract Main {
    event Create(address contractAddr);
    event Add();
    event Remove();

    mapping(address => TodoList[]) lists;

    function createList(bytes32 title, bool isPrivate) public {
        TodoList list = new TodoList(title, msg.sender, lists[msg.sender].length, isPrivate);
        lists[msg.sender].push(list);

        emit Create(address(list));
    }

    function addList(address listAddr) public {
        TodoList list = TodoList(listAddr);
        lists[msg.sender].push(list);

        emit Add();
    }

    function removeList(address listAddr) public {
        TodoList ref = TodoList(listAddr);
        //- get index of item being removed
        uint index = ref.getIndex();
        //- get address of last item
        address addr = address(lists[msg.sender][lists[msg.sender].length - 1]);
        //- set address at index of item being removed to the address of the last item
        lists[msg.sender][index] = TodoList(addr);
        //- set index of the moved item to the index where item was removed
        lists[msg.sender].pop();
        //- [arrayName].pop()

        emit Remove();
    }

    function hasListSaved(address listAddr) public view returns(bool) {
        for (uint i = 0; i < lists[msg.sender].length; i++) {
            if (lists[msg.sender][i] == TodoList(listAddr)) {
                return true;
            }
        }

        return false;
    }

    function getLists() public view returns(TodoList[] memory) {
        return lists[msg.sender];
    }
}