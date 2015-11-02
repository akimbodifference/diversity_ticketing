class ApplicationsController < ApplicationController
  before_action :get_event, only: [:show, :new, :create]
  skip_before_action :authenticate, only: [:new]

  def show
    @application = @event.applications.find(params[:id])
  end

	def new
    @application = @event.applications.build
	end

  def create
    @application = Application.new(application_params)
    @application.event = @event
    if @application.save
      redirect_to @event, notice: "You have successfully applied for #{@event.name}."
    else 
      render :new
    end
  end

  private
    def application_params
      params.require(:application).permit(:name, :email, :email_confirmation, :answer_1, :answer_2, :answer_3)
    end

    def get_event
      @event = Event.find(params[:event_id])
    end
end