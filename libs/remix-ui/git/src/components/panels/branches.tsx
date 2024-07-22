import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { gitActionsContext } from "../../state/context";
import { remote } from "../../types";
import GitUIButton from "../buttons/gituibutton";
import { gitPluginContext } from "../gitui";
import { LocalBranchDetails } from "./branches/localbranchdetails";
import { RemoteBranchDetails } from "./branches/remotebranchedetails";

export const Branches = () => {
  const context = React.useContext(gitPluginContext)
  const actions = React.useContext(gitActionsContext)
  const [newBranch, setNewBranch] = useState({ value: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBranch({ value: e.currentTarget.value });
  };

  return (
    <>
      <div data-id='branches-panel-content' className="pt-2">
        {context.branches && context.branches.length ?
          <div>
            {context.branches && context.branches.filter((branch, index) => !branch.remote).map((branch, index) => {
              return (
                <LocalBranchDetails key={index} branch={branch}></LocalBranchDetails>
              );
            })}
            <hr />

          </div> : null}
        {context.currentBranch
          && context.currentBranch.name !== ''
          && (!context.branches || context.branches.length === 0) ?
          <div className="text-muted">Current branch is <strong className="text-dark">{`${context.currentBranch.name}`}</strong> but you have no commits.</div>
          : null}
        <label className="text-uppercase pt-2 pb-1">Create branch</label>
        <div className="form-group">

          <input
            placeholder="branch name"
            onChange={handleChange}
            className="form-control w-md-25 w-100"
            data-id="newbranchname"
            type="text"
            id="newbranchname"
          />
        </div>
        <GitUIButton
          data-id="sourcecontrol-create-branch"
          onClick={async () => actions.createBranch(newBranch.value)}
          className="btn w-md-25 w-100 btn-primary mb-3"
          id="createbranch-btn"
        >
          create new branch
        </GitUIButton>
      </div>
    </>
  );
}
