import React from "react";
import { Modal, Alert } from "antd";
interface CampaignManageAlerProps {
  handleModalOk: () => void;
  handleModalCancel: () => void;
  cancelClicked: boolean;
  restartClicked: boolean;
  planSelect: string;
  planSelectPricing: number;
  status: string;
  secondaryStatus: string;  
}
const CampaignManageAlert: React.FC<CampaignManageAlerProps> = function(
  {handleModalCancel, handleModalOk, cancelClicked, status, restartClicked, planSelect, 
    planSelectPricing, secondaryStatus
  }
) {
  return (
    <>    
        {status === 'stopped' ? (
          <Alert 
              message="Your campaign is not running. Click 'restart' below to start it again.                         "
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
          />
      ) : (
          <Alert 
              message="Updates will apply immediately and be valid for the remainder of your current month. Updates will also apply for following months."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
          />
      )}

        {secondaryStatus != "" ? (
            <Alert 
              message="You have selected a new plan, but not updated your account. Please click Update below to confirm your new plan.
              Do nothing to keep existing plan"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
          />
        ) : (null)}
      <Modal
          title="Confirm Cancellation"
          open={cancelClicked}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Yes, Cancel"
          cancelText="No"
      >
          <p>Are you sure you want to cancel this campaign? You will not be charged again.</p>
          <p>Your campaign will continue to run until the end of your billing period.</p>
          {/* You can add more detailed text or even additional content here */}
      </Modal>

      <Modal
          title="Confirm Restart Campaign"
          open={restartClicked}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Yes, Start Campaign"
          cancelText="No"
      >
          <p>Are you sure you want to restart this campaign? You will be charged today for your selected plan: 
              <b>{' '+planSelect}</b> which is <b>${planSelectPricing}.00</b> / month
          </p>
          <p>You can change the plan by clicking 'No' on this confirm box, selecting the plan below and then clicking 'Restart Campaign' again.</p>
          <p>You can expect to start seeing results within a few hours to one day.</p>
          {/* You can add more detailed text or even additional content here */}
      </Modal>
    </>

  )
}

export default CampaignManageAlert;