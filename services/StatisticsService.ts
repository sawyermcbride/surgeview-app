import {query} from "../db";
//StatisticsService.ts class

interface getCampaignStatusDetailsReturn {
    error: string,
    numberofActive: number;
    numberofSetup: number;
}

interface getBaseStatisicsType {
    errors: Array<string>;
    status: object;
    statistics: getCampaignStatisticsType;
}

interface getCampaignStatisticsType {
    error: string;
    views: {
        lastDay: number;
        lastWeek: number;
    };
    subscribers: {
        lastDay: number;
        lastWeek: number;
    };
    campaigns: Record<string, any>; 
}


class StatisticsService {
    private db: Function;

    constructor() {
        this.db = query;
    }
    
    public async getBaseStatisics (email: string): Promise<getBaseStatisicsType> {
        const userEmail = email;
        let status = await this.getCampaignStatusDetails(email);
        let statistics = await this.getCampaignStatistics(email);
        let errors: Array<string> = [];
        
        if(status.error) {
            errors.push(status.error)
        }
        if(statistics.error) {
            errors.push(statistics.error);
        }

        return {
            status,
            statistics,
            errors
        }
        
    }

    private async getCampaignStatistics(email: string): Promise<getCampaignStatisticsType> {

        let defaultReturn: getCampaignStatisticsType = {
            error: "",
            views: {
                lastDay: 0,
                lastWeek: 0,
            }, 
            subscribers: {
                lastDay: 0,
                lastWeek: 0
            },
            campaigns: {}
        }

        try {

            const result = await this.db(`
            SELECT cs.campaign_id, cs.views, cs.likes, cs.comments, cs.start_timestamp,
            cs.subscribers, cs.end_timestamp, cs.time_period
            FROM customers AS cu
            JOIN campaigns AS c ON cu.id = c.customer_id
            JOIN campaignstatistics AS cs ON c.campaign_id = cs.campaign_id
            WHERE cu.email = $1 ORDER BY cs.end_timestamp DESC;`, [email]);
    
            const currentTime = new Date();
            const sevenDaysAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 *1000);
    
            const lastDay = result.rows[0]; 
            const filteredArr = result.rows.filter(elem => {
                const itemDate = new Date(elem.end_timestamp);
                return itemDate > sevenDaysAgo;
            })

            
            const totalViewsValue = filteredArr.reduce( (sum, elem) => sum + elem.views, 0);
            const totalSubscribersValue = filteredArr.reduce( (sum, elem) => sum + elem.subscribers, 0);
    
            const groupedCampaignStatistics = this.getStatisticsByCampaignId(result.rows);
            
            defaultReturn.views.lastDay = lastDay?.views ?? 0;
            defaultReturn.views.lastWeek = totalViewsValue ?? 0;
            defaultReturn.subscribers.lastDay = lastDay?.subscribers ?? 0;
            defaultReturn.subscribers.lastWeek = totalSubscribersValue ?? 0;
            defaultReturn.campaigns = groupedCampaignStatistics ?? {};

            return defaultReturn;

        } catch(error) {
            defaultReturn.error = error.message;
            return defaultReturn;
        } 
    }

    private async getCampaignStatusDetails (email): Promise<getCampaignStatusDetailsReturn> {
        try {

            const queryUrl = `SELECT * FROM campaigns JOIN customers ON customers.id = campaigns.customer_id
             WHERE customers.email = $1 AND (campaigns.status = $2 OR campaigns.status = $3)`;
            let result  = await this.db(queryUrl, [email, 'active', 'setup']);
            const numberofActive = result.rows.filter(obj => obj.status === 'active').length;
            const numberofSetup = result.rows.filter(obj => obj.status === 'setup').length;
    
            return {error: "", numberofActive, numberofSetup};
        } catch(error) {
            return {error: error.message, numberofActive: 0, numberofSetup: 0}
        }

    }
        


    private getStatisticsByCampaignId(arr: Array): Array {
        let groupedCampaigns = {};

        arr.forEach(element => {
           if(!(element.campaign_id in groupedCampaigns)) {
                groupedCampaigns[element.campaign_id] = [];
            } 
            groupedCampaigns[element.campaign_id].push(element);
        });
        return groupedCampaigns;
    }
}

export default StatisticsService;