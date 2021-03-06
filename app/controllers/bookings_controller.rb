class BookingsController < ApplicationController
  before_action :set_booking, only: [:show, :update, :destroy, :authenticate_user_included!]
  before_action :authenticate_user!
  before_action :authenticate_user_included!, only:  [:patch, :destroy]

  def index
    if params[:format] === "received"
      bookings = Booking.all.select do | booking|
        booking.offer.bike.owner_id === current_user.id
      end
    elsif params[:format] === "sent"
      bookings = Booking.where(tenant_id: current_user.id)
    else
      bookings = Booking.all
    end
    render json: bookings.map{|booking|booking.build("offer")}
  end

  def show
    render_jsonapi_response(@booking)
  end

  def create
    puts current_user
    @booking = Booking.new(booking_params)
    @booking.tenant_id = current_user.id
    @booking.save
    render_jsonapi_response(@booking)
  end

  def update
    if @booking.update(booking_params)
      render json: @booking
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if params[:format] === "accept"
      UserMailer.tenant_booking_email(@booking).deliver_now
      UserMailer.owner_booking_email(@booking).deliver_now
    end
    @booking.destroy
  end

  private
    def set_booking
      @booking = Booking.find(params[:id])
    end

    def authenticate_user_included!
      return current_user === @booking.tenant || current_user === @booking.offer.bike.owner
    end

    def booking_params
      params.require(:booking).permit(:tenant_id_id, :start_date, :end_date, :offer_id)
    end
end
